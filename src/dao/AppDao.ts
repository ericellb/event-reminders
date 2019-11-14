import { Database } from 'sqlite3';

export class AppDAO {
  public db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath, err => {
      if (err) {
        console.log('Couldnt connect to Database');
      } else {
        console.log('Connected to Database');
      }
    });
  }

  // Create / Update / Insert that returns ID of change
  public run(sql: string, params: any[]) {
    return new Promise<{ id: number }>((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.log('Error running sql : ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }
}