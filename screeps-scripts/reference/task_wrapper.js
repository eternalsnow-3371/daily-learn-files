class TaskWrapper {
    constructor(taskPublisher, executorPrediction, task) {
        this.taskPublisher = taskPublisher;
        this.executorPrediction = executorPrediction;
        this.task = task;
        this.executor = null;
    }

    cleanExecutor(executor) {
        this.executor = null;
    }

    adaptExecutor(executor) {
        if (this.executorPrediction(executor)) {
            this.executor = executor;
            return true;
        } else {
            this.executor = null;
            return false;
        }
    }

    run(executor) {
        if (this.executor) {
            this.task(this.executor, this.taskPublisher);
        }
    }
}