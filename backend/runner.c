#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>
#include <sys/time.h>
#include <time.h>
#include <errno.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <string.h>

static pid_t child_pid = -1;

#define OUTPUT_LIMIT (64LL * 1024LL * 1024LL)

/*
 * Checker gets a separate timeout.
 *
 * You can change this later.
 */
#define CHECKER_TIME_LIMIT_MS 2000


// ============================================================
// Utility
// ============================================================

long long now_ns() {

    struct timespec ts;

    clock_gettime(CLOCK_MONOTONIC, &ts);

    return (long long)ts.tv_sec * 1000000000LL
         + ts.tv_nsec;
}


long long get_memory() {

    FILE *file = fopen(
        "/sys/fs/cgroup/memory.peak",
        "r"
    );

    if (!file)
        return -1;

    long long bytes = 0;

    fscanf(
        file,
        "%lld",
        &bytes
    );

    fclose(file);

    return bytes;
}


long long get_output_size(const char *path) {

    struct stat st;

    if (stat(path, &st) == -1)
        return -1;

    return st.st_size;
}


// ============================================================
// Contestant timeout
// ============================================================

void timeout_handler(int sig) {

    if (child_pid > 0) {

        kill(
            child_pid,
            SIGKILL
        );
    }
}


// ============================================================
// Checker timeout
// ============================================================

static pid_t checker_pid = -1;


void checker_timeout_handler(int sig) {

    if (checker_pid > 0) {

        kill(
            checker_pid,
            SIGKILL
        );
    }
}


// ============================================================
// Run checker
//
// checker:
//     /judge/checker
//
// Arguments passed to checker:
//
//     argv[1] = input
//     argv[2] = expected output
//     argv[3] = contestant output
//
// Return:
//
//     0 = Accepted
//     1 = Wrong Answer
//     2 = Checker Error
// ============================================================

int run_checker(
    const char *checker,
    const char *input_file,
    const char *expected_file,
    const char *output_file
) {

    checker_pid = fork();

    if (checker_pid == -1) {

        perror("fork checker");

        return 2;
    }


    // --------------------------------------------------------
    // Checker process
    // --------------------------------------------------------

    if (checker_pid == 0) {

        /*
         * We don't need stdin for the checker.
         *
         * Redirect it from /dev/null so that a checker
         * cannot accidentally wait for input.
         */

        int null_fd = open(
            "/dev/null",
            O_RDONLY
        );

        if (null_fd == -1) {

            perror("open /dev/null");

            exit(127);
        }

        if (dup2(
            null_fd,
            STDIN_FILENO
        ) == -1) {

            perror("dup2 checker stdin");

            close(null_fd);

            exit(127);
        }

        close(null_fd);


        /*
         * Checker stderr goes to the runner's stderr.
         *
         * This is useful for debugging checker problems.
         */

        execl(
            checker,
            checker,

            input_file,
            expected_file,
            output_file,

            (char *)NULL
        );


        perror("exec checker");

        exit(127);
    }


    // --------------------------------------------------------
    // Setup checker timeout
    // --------------------------------------------------------

    struct sigaction checker_sa;

    checker_sa.sa_handler =
        checker_timeout_handler;

    sigemptyset(
        &checker_sa.sa_mask
    );

    checker_sa.sa_flags = 0;

    sigaction(
        SIGALRM,
        &checker_sa,
        NULL
    );


    struct itimerval timer;

    timer.it_value.tv_sec =
        CHECKER_TIME_LIMIT_MS / 1000;

    timer.it_value.tv_usec =
        (CHECKER_TIME_LIMIT_MS % 1000) * 1000;

    timer.it_interval.tv_sec = 0;

    timer.it_interval.tv_usec = 0;


    setitimer(
        ITIMER_REAL,
        &timer,
        NULL
    );


    // --------------------------------------------------------
    // Wait for checker
    // --------------------------------------------------------

    int status;

    while (1) {

        pid_t result = waitpid(
            checker_pid,
            &status,
            0
        );


        if (result == checker_pid) {

            break;
        }


        if (result == -1) {

            if (errno == EINTR) {

                continue;
            }


            perror("waitpid checker");

            setitimer(
                ITIMER_REAL,
                &(struct itimerval){0},
                NULL
            );

            return 2;
        }
    }


    // --------------------------------------------------------
    // Stop checker timer
    // --------------------------------------------------------

    setitimer(
        ITIMER_REAL,
        &(struct itimerval){0},
        NULL
    );


    // --------------------------------------------------------
    // Checker exit
    // --------------------------------------------------------

    if (WIFEXITED(status)) {

        int code =
            WEXITSTATUS(status);


        fprintf(
            stderr,
            "__CHECKER_EXIT__ %d\n",
            code
        );


        if (code == 0) {

            fprintf(
                stderr,
                "__ACCEPTED__\n"
            );

            return 0;
        }


        if (code == 1) {

            fprintf(
                stderr,
                "__WA__\n"
            );

            return 1;
        }


        fprintf(
            stderr,
            "__CHECKER_ERROR__\n"
        );

        return 2;
    }


    // --------------------------------------------------------
    // Checker killed by signal
    // --------------------------------------------------------

    if (WIFSIGNALED(status)) {

        int sig =
            WTERMSIG(status);


        fprintf(
            stderr,
            "__CHECKER_SIGNAL__ %d\n",
            sig
        );


        /*
         * SIGKILL here means the checker exceeded
         * its time limit.
         */

        if (sig == SIGKILL) {

            fprintf(
                stderr,
                "__CHECKER_TLE__\n"
            );
        }


        fprintf(
            stderr,
            "__CHECKER_ERROR__\n"
        );

        return 2;
    }


    return 2;
}


// ============================================================
// Main
// ============================================================

int main(int argc, char **argv) {

    /*
     * New format:
     *
     * runner
     *     <time_limit_ms>
     *     <output_file>
     *     <checker>
     *     <program>
     *     [args...]
     */

    if (argc < 5) {

        fprintf(
            stderr,
            "Usage: runner "
            "<time_limit_ms> "
            "<output_file> "
            "<checker> "
            "<program> "
            "[args...]\n"
        );

        return 2;
    }


    long long time_limit_ms =
        atoll(argv[1]);


    const char *output_file =
        argv[2];


    const char *checker =
        argv[3];


    const char *program =
        argv[4];


    // ========================================================
    // Setup contestant timeout
    // ========================================================

    struct sigaction sa;

    sa.sa_handler =
        timeout_handler;

    sigemptyset(
        &sa.sa_mask
    );

    sa.sa_flags = 0;

    sigaction(
        SIGALRM,
        &sa,
        NULL
    );


    // ========================================================
    // Start contestant
    // ========================================================

    child_pid = fork();


    if (child_pid == -1) {

        perror("fork");

        return 2;
    }


    // ========================================================
    // Contestant process
    // ========================================================

    if (child_pid == 0) {

        // ----------------------------------------------------
        // Open output file
        // ----------------------------------------------------

        int fd = open(
            output_file,
            O_WRONLY | O_CREAT | O_TRUNC,
            0600
        );


        if (fd == -1) {

            perror("open output");

            exit(127);
        }


        // ----------------------------------------------------
        // stdout -> output file
        // ----------------------------------------------------

        if (dup2(
            fd,
            STDOUT_FILENO
        ) == -1) {

            perror("dup2 stdout");

            close(fd);

            exit(127);
        }


        close(fd);


        // ----------------------------------------------------
        // stdin <- input.txt
        // ----------------------------------------------------

        int input_fd = open(
            "/judge/input.txt",
            O_RDONLY
        );


        if (input_fd == -1) {

            perror("open input");

            exit(127);
        }


        if (dup2(
            input_fd,
            STDIN_FILENO
        ) == -1) {

            perror("dup2 stdin");

            close(input_fd);

            exit(127);
        }


        close(input_fd);


        // ----------------------------------------------------
        // Run contestant
        // ----------------------------------------------------

        execv(
            program,
            &argv[4]
        );


        perror("execv");

        exit(127);
    }


    // ========================================================
    // Start timer
    // ========================================================

    long long start =
        now_ns();


    struct itimerval timer;


    timer.it_value.tv_sec =
        time_limit_ms / 1000;


    timer.it_value.tv_usec =
        (time_limit_ms % 1000) * 1000;


    timer.it_interval.tv_sec = 0;

    timer.it_interval.tv_usec = 0;


    setitimer(
        ITIMER_REAL,
        &timer,
        NULL
    );


    // ========================================================
    // Monitor contestant
    // ========================================================

    int status;


    while (1) {

        pid_t result =
            waitpid(
                child_pid,
                &status,
                WNOHANG
            );


        // ----------------------------------------------------
        // Contestant finished
        // ----------------------------------------------------

        if (result == child_pid) {

            break;
        }


        // ----------------------------------------------------
        // waitpid error
        // ----------------------------------------------------

        if (result == -1) {

            if (errno == EINTR) {

                continue;
            }


            perror("waitpid");

            setitimer(
                ITIMER_REAL,
                &(struct itimerval){0},
                NULL
            );

            return 2;
        }


        // ----------------------------------------------------
        // Check output size
        // ----------------------------------------------------

        long long output_size =
            get_output_size(
                output_file
            );


        if (output_size > OUTPUT_LIMIT) {

            kill(
                child_pid,
                SIGKILL
            );


            waitpid(
                child_pid,
                &status,
                0
            );


            setitimer(
                ITIMER_REAL,
                &(struct itimerval){0},
                NULL
            );


            long long end =
                now_ns();


            double elapsed_ms =
                (end - start)
                / 1000000.0;


            fprintf(
                stderr,
                "__TIME__ %.3f\n",
                elapsed_ms
            );


            fprintf(
                stderr,
                "__MEMORY__ %lld\n",
                get_memory()
            );


            fprintf(
                stderr,
                "__OUTPUT__ %lld\n",
                output_size
            );


            fprintf(
                stderr,
                "__OLE__\n"
            );


            return 125;
        }


        // ----------------------------------------------------
        // Don't busy-loop
        // ----------------------------------------------------

        usleep(1000);
    }


    // ========================================================
    // Stop contestant timer
    // ========================================================

    setitimer(
        ITIMER_REAL,
        &(struct itimerval){0},
        NULL
    );


    // ========================================================
    // Calculate time
    // ========================================================

    long long end =
        now_ns();


    double elapsed_ms =
        (end - start)
        / 1000000.0;


    // ========================================================
    // Output metadata
    // ========================================================

    long long output_size =
        get_output_size(
            output_file
        );


    fprintf(
        stderr,
        "__TIME__ %.3f\n",
        elapsed_ms
    );


    fprintf(
        stderr,
        "__MEMORY__ %lld\n",
        get_memory()
    );


    fprintf(
        stderr,
        "__OUTPUT__ %lld\n",
        output_size
    );


    // ========================================================
    // Contestant exit status
    // ========================================================

    if (WIFEXITED(status)) {

        int code =
            WEXITSTATUS(status);


        fprintf(
            stderr,
            "__EXIT__ %d\n",
            code
        );


        /*
         * Contestant itself failed.
         *
         * Don't run the checker.
         */

        if (code != 0) {

            return code;
        }


        // ====================================================
        // Run checker
        // ====================================================

        int checker_code =
            run_checker(
                checker,
                "/judge/input.txt",
                "/judge/expected.txt",
                output_file
            );


        if (checker_code == 0) {

            return 0;
        }


        if (checker_code == 1) {

            return 1;
        }


        return 2;
    }


    // ========================================================
    // Contestant killed by signal
    // ========================================================

    if (WIFSIGNALED(status)) {

        int sig =
            WTERMSIG(status);


        fprintf(
            stderr,
            "__SIGNAL__ %d\n",
            sig
        );


        if (sig == SIGKILL) {

            fprintf(
                stderr,
                "__TLE__\n"
            );


            return 124;
        }


        return 128 + sig;
    }


    return 1;
}