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

static pid_t child_pid = -1;

#define OUTPUT_LIMIT (64LL * 1024LL * 1024LL)

void timeout_handler(int sig) {
    if (child_pid > 0) {
        kill(child_pid, SIGKILL);
    }
}

long long get_memory() {
    FILE *file = fopen("/sys/fs/cgroup/memory.peak", "r");

    if (!file)
        return -1;

    long long bytes = 0;

    fscanf(file, "%lld", &bytes);

    fclose(file);

    return bytes;
}

long long get_output_size(const char *path) {
    struct stat st;

    if (stat(path, &st) == -1)
        return -1;

    return st.st_size;
}

long long now_ns() {
    struct timespec ts;

    clock_gettime(CLOCK_MONOTONIC, &ts);

    return (long long)ts.tv_sec * 1000000000LL
         + ts.tv_nsec;
}

int main(int argc, char **argv) {

    if (argc < 4) {
        fprintf(
            stderr,
            "Usage: runner <time_limit_ms> <output_file> <program> [args...]\n"
        );

        return 2;
    }

    long long time_limit_ms = atoll(argv[1]);

    const char *output_file = argv[2];

    // -------------------------
    // Setup timeout
    // -------------------------

    struct sigaction sa;

    sa.sa_handler = timeout_handler;

    sigemptyset(&sa.sa_mask);

    sa.sa_flags = 0;

    sigaction(SIGALRM, &sa, NULL);

    // -------------------------
    // Start program
    // -------------------------

    child_pid = fork();

    if (child_pid == -1) {
        perror("fork");
        return 2;
    }

    if (child_pid == 0) {

        // Open output file

        int fd = open(
            output_file,
            O_WRONLY | O_CREAT | O_TRUNC,
            0600
        );

        if (fd == -1) {
            perror("open output");
            exit(127);
        }

        // stdout -> output file

        if (dup2(fd, STDOUT_FILENO) == -1) {
            perror("dup2");
            close(fd);
            exit(127);
        }

        close(fd);

        int input_fd = open("/judge/input.txt", O_RDONLY);

        if (input_fd == -1) {
            perror("open input");
            exit(127);
        }

        if (dup2(input_fd, STDIN_FILENO) == -1) {
            perror("dup2 stdin");
            close(input_fd);
            exit(127);
        }

        close(input_fd);

        // Run contestant

        execv(argv[3], &argv[3]);

        perror("execv");

        exit(127);
    }

    // -------------------------
    // Timer
    // -------------------------

    long long start = now_ns();

    struct itimerval timer;

    timer.it_value.tv_sec = time_limit_ms / 1000;

    timer.it_value.tv_usec =
        (time_limit_ms % 1000) * 1000;

    timer.it_interval.tv_sec = 0;
    timer.it_interval.tv_usec = 0;

    setitimer(
        ITIMER_REAL,
        &timer,
        NULL
    );

    // -------------------------
    // Monitor process
    // -------------------------

    int status;

    while (1) {

        pid_t result = waitpid(
            child_pid,
            &status,
            WNOHANG
        );

        if (result == child_pid) {
            break;
        }

        if (result == -1) {

            if (errno == EINTR)
                continue;

            perror("waitpid");

            return 2;
        }

        // Check output size

        long long output_size =
            get_output_size(output_file);

        if (output_size > OUTPUT_LIMIT) {

            kill(child_pid, SIGKILL);

            waitpid(child_pid, &status, 0);

            setitimer(
                ITIMER_REAL,
                &(struct itimerval){0},
                NULL
            );

            long long end = now_ns();

            double elapsed_ms =
                (end - start) / 1000000.0;

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

            fprintf(stderr, "__OLE__\n");

            return 125;
        }

        // Don't busy-loop

        usleep(1000);
    }

    // -------------------------
    // Stop timer
    // -------------------------

    struct itimerval stop = {0};

    setitimer(
        ITIMER_REAL,
        &stop,
        NULL
    );

    // -------------------------
    // Calculate time
    // -------------------------

    long long end = now_ns();

    double elapsed_ms =
        (end - start) / 1000000.0;

    // -------------------------
    // Output metadata
    // -------------------------

    long long output_size =
        get_output_size(output_file);

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

    // -------------------------
    // Exit status
    // -------------------------

    if (WIFEXITED(status)) {

        int code = WEXITSTATUS(status);

        fprintf(
            stderr,
            "__EXIT__ %d\n",
            code
        );

        return code;
    }

    if (WIFSIGNALED(status)) {

        int sig = WTERMSIG(status);

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