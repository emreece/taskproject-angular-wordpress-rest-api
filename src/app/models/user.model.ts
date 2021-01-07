export class userData {
    username: string;
    userID: number;
    roles: Array<string>

    constructor() { 
        this.username = '';
        this.userID = 0;
        this.roles = ['subscriber']; // Default
    }
}