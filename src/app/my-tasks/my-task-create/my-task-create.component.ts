import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { newTaskData } from 'src/app/models/task.model';
import { userTasksService } from 'src/app/services/userTasks.service';

@Component({
  selector: 'app-my-task-create',
  templateUrl: './my-task-create.component.html',
  styleUrls: ['./my-task-create.component.css']
})
export class MyTaskCreateComponent implements OnInit {
  @ViewChild('taskCreateForm', {static:false}) taskCreateForm: NgForm;
  myTask = new newTaskData();
  taskStatuses = new Array();
  taskStatus: string;
  taskID: number;
  constructor(public dialog: MatDialog, private uTasksService: userTasksService) { }

  ngOnInit(): void {
    this.uTasksService.getCategories().subscribe(
      res => {
         this.taskStatuses = res;
         this.taskStatus= res[0].id;
      }
    )
  }
  onCreateTaskForm() {
    const newTaskData : newTaskData = 
    {
      title:this.taskCreateForm.value.taskTitle,
      content:this.taskCreateForm.value.taskContent,
      status: 'publish',
      categories: [this.taskCreateForm.value.taskStatus]
    };
    console.log(newTaskData);
    this.uTasksService.createTask(newTaskData).subscribe(
      res => {
        this.taskID = res.id;
        this.dialog.open(taskDialog, {
          data: {
            dialogMessage: "Your task is created!",
            taskID: this.taskID
          }
        });
      }
    )
  }
}
@Component({
  selector: 'task-dialog',
  template: `<div mat-dialog-content>
            <p>{{ dialogMessage }}</p>
          </div>
          <div mat-dialog-actions align="end">
            <button class="btn btn-success" mat-button mat-dialog-close (click)="closeDialog()">Close</button>
          </div>`
})
export class taskDialog {
  dialogMessage: string;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<taskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
    this.dialogMessage = this.data.dialogMessage;
  }
  closeDialog(){
    this.dialog.closeAll();
    this.router.navigate(['my-tasks',this.data.taskID]);
  }
}