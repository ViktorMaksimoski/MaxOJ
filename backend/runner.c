#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>
#include <sys/time.h>
#include <time.h>
#include <errno.h>

static pid_t child_pid = -1;

void timeout_handler(int sig) {
    if (child_pid > 0) {
        kill(child_pid, SIGKILL);
    }
}

long long get_memory() {
    FILE *file = fopen("/sys/fs/cgroup/memory.peak", "r");

    if(!file) return -1;

    long long bytes = 0;
    fscanf(file, "%lld", &bytes);
    fclose(file);

    return bytes;
}

long long now_ns() {
    struct timespec ts;

    clock_gettime(CLOCK_MONOTONIC, &ts);

    return (long long)ts.tv_sec * 1000000000LL
         + ts.tv_nsec;
}

int main(int argc, char **argv) {

    if (argc < 3) {
        fprintf(stderr, "Usage: runner <time_limit_ms> <program> [args...]\n");
        return 2;
    }

    long long time_limit_ms = atoll(argv[1]);

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

        // argv:
        //
        // runner
        // 1000
        // /judge/main
        // arg1
        // ...

        execv(argv[2], &argv[2]);

        perror("execv");
        exit(127);
    }

    // -------------------------
    // Timer starts HERE
    // -------------------------

    long long start = now_ns();

    // alarm() only has second precision,
    // so use setitimer for millisecond precision.

    struct itimerval timer;

    timer.it_value.tv_sec = time_limit_ms / 1000;
    timer.it_value.tv_usec = (time_limit_ms % 1000) * 1000;

    timer.it_interval.tv_sec = 0;
    timer.it_interval.tv_usec = 0;

    setitimer(ITIMER_REAL, &timer, NULL);

    // -------------------------
    // Wait for program
    // -------------------------

    int status;

    while (waitpid(child_pid, &status, 0) == -1) {
        if (errno == EINTR)
            continue;

        perror("waitpid");
        return 2;
    }

    // Stop timer
    struct itimerval stop = {0};
    setitimer(ITIMER_REAL, &stop, NULL);

    // -------------------------
    // Calculate time
    // -------------------------

    long long end = now_ns();

    double elapsed_ms = (end - start) / 1000000.0;

    // -------------------------
    // Output result
    // -------------------------

    fprintf(stderr, "__TIME__ %.3f\n", elapsed_ms);

    long long peak_memory = get_memory();

    fprintf(stderr, "__MEMORY__ %lld\n", peak_memory);

    if (WIFEXITED(status)) {

        int code = WEXITSTATUS(status);

        fprintf(stderr, "__EXIT__ %d\n", code);

        return code;
    }

    if (WIFSIGNALED(status)) {

        int sig = WTERMSIG(status);

        fprintf(stderr, "__SIGNAL__ %d\n", sig);

        if (sig == SIGKILL) {
            fprintf(stderr, "__TLE__\n");
            return 124;
        }

        return 128 + sig;
    }

    return 1;
}