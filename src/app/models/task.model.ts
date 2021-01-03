export class taskData {
    title: { rendered: string } = { rendered:'' };
    content: { rendered: string } = { rendered:'' };
    taskID: number = 0;
    status ?: string = '';
    authorID ?: number =  0;
    userID ?: number = 0;
    categories ?: Array<number> = [0]; 
    constructor() {
        
    }
}

export class newTaskData {
    title: { rendered: string } = { rendered:'' };
    content: { rendered: string } = { rendered:'' };
    status ?: string = '';
    authorID ?: number =  0;
    userID ?: number = 0;
    categories ?: Array<number> = [0]; 
    constructor() {
        
    }
}