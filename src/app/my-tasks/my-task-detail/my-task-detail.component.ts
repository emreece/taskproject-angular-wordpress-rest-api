import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ActivatedRoute} from '@angular/router';
import { taskData } from 'src/app/models/task.model';
import { userTasksService } from 'src/app/services/userTasks.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-my-task-detail',
  templateUrl: './my-task-detail.component.html',
  styleUrls: ['./my-task-detail.component.css']
})
export class MyTaskDetailComponent implements OnInit {
  @ViewChild('taskEditForm', {static:false}) taskEditForm: NgForm;
  myTask = new taskData();
  taskID: number;
  taskStatus: {id:number, name:string} = {id:0, name:''};
  isEditing: boolean = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '250px',
      placeholder: 'Enter task details here...',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ]
  };
  constructor(public dialog: MatDialog, private uTasksService: userTasksService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskID = +params['id'];
      this.getMyTaskData();
    });
    this.route.queryParams.subscribe(params => {
      this.isEditing = Boolean(params['edit']);
    });
  }
  onUpdateTaskStatus(catID:number): void {
    this.uTasksService.updateTaskStatus(this.taskID, catID).subscribe((data:any)=> {
      this.getMyTaskData();
 
      this.dialog.open(updatedTaskDialog, {
        data: {
          dialogMessage: "Your task status is updated!"
        }
      });
    })
  }
  getMyTaskData() {
    this.uTasksService.getMyTask(this.taskID).subscribe((data:any)=> {
      this.myTask = new taskData();
      this.myTask = data;
      this.uTasksService.getCategory(this.myTask.categories[0]).subscribe(
        res => {
          this.taskStatus.id = this.myTask.categories[0];
          this.taskStatus.name = res.name;
        }
      )
    })
  }
  onEditTaskForm() {
   /*  console.log(this.taskEditForm.value); */
    const newTaskData : taskData = 
    {
      title:this.taskEditForm.value.taskTitle,
      content:this.taskEditForm.value.taskContent,
      taskID:this.taskID,
    };
    this.uTasksService.updateTask(newTaskData).subscribe(
      res => {
  /*       console.log('res');
        console.log(res); */
        this.dialog.open(updatedTaskDialog, {
          data: {
            dialogMessage: "Your task is updated!"
          }
        });
      }
    )
  }
  onOpenEditForm() {
    this.isEditing = true;
  }
  onCloseEditForm() {
    this.isEditing = false;
  }
}
@Component({
  selector: 'updated-task-dialog',
  template: `<div mat-dialog-content>
            <p>{{ dialogMessage }}</p>
          </div>
          <div mat-dialog-actions align="end">
            <button class="btn btn-success" mat-button mat-dialog-close (click)="closeDialog()">Close</button>
          </div>`
})
export class updatedTaskDialog {
  dialogMessage: string;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<updatedTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogMessage = this.data.dialogMessage;
  }
  closeDialog(){
    this.dialog.closeAll();
  }
}