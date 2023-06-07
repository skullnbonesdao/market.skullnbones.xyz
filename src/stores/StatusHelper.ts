export interface Status {
  is_initialized: boolean;
  is_loading: boolean;
  message: string;
  step_current: number;
  step_total: number;
}

export class StatusHelper {
  status: Status;
  constructor() {
    this.status = {
      is_initialized: true,
      is_loading: false,
      message: "initalized",
      step_current: 0,
      step_total: 0,
    };
  }

  get() {
    return this.status.is_loading;
  }

  status_set(message: string, step_current: number, step_total: number) {
    this.status.is_loading = true;
    this.status.message = message;
    this.status.step_current = step_current;
    this.status.step_total = step_total;
  }
  status_inc() {
    this.status.step_current += 1;
  }
  done() {
    this.status.is_loading = false;
  }
}
