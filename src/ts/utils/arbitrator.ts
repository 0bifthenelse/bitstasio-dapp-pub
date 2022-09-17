export default class Arbitrator {
  static TRANSACTION_DELAY: number = 16e4;
  static TRANSACTION_AFTERMATH_DELAY: number = 5e3;

  static async execute(transaction: Function, details: TransactionData, loading_state?: Function): Promise<void> {
    try {
      if (loading_state) loading_state(true);

      await new Promise(async (resolve: Function, reject: Function) => {
        try {
          const timer = setTimeout(() => reject(), this.TRANSACTION_DELAY);

          await transaction(details);

          clearTimeout(timer);

          await new Promise((resolve: Function) => setTimeout(() => resolve(), this.TRANSACTION_AFTERMATH_DELAY));

          return resolve();
        } catch (_) {
          if (loading_state) return loading_state(false);
        }
      });

      if (loading_state) return loading_state(false);
    } catch (_) {
      if (loading_state) return loading_state(false);
    }
  }
}