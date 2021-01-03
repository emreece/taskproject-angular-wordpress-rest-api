import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { taskData } from 'src/app/models/task.model';
import { userTasksService } from 'src/app/services/userTasks.service';

@Component({
  selector: 'app-my-tasks-home',
  templateUrl: './my-tasks-home.component.html',
  styleUrls: ['./my-tasks-home.component.css']
})
export class MyTasksHomeComponent implements OnInit {
  tasks: Array<taskData> = [];
  selectedCat: number;
  tasksTitle = '';
  taskStatuses: Array<any> = [];
  constructor(
    private router: Router, 
    private uTasksService: userTasksService,  
    private route: ActivatedRoute) { }

  ngOnInit(): void { 
    this.uTasksService.getCategories().subscribe(
      res => {
         this.taskStatuses = res
      }
    )

    this.route.queryParams.subscribe(queryParams => {
    this.selectedCat = queryParams['cat'];
     
    if(typeof this.selectedCat != 'undefined') {
      this.uTasksService.getCategory(this.selectedCat).subscribe(
        res => {
          this.tasksTitle = res.name;
        }
      )
    }
      this.uTasksService.getMyTasks(this.selectedCat).subscribe(
        res => {
         /*  console.log(res); */
          this.tasks = res;
        }
      )
    })
    if(!this.selectedCat) {
      this.tasksTitle = 'All';
    }
  }
  onSelectCategory(catID:number, catName:string) {
   /*  console.log(catID); */
    this.tasksTitle = catName;
    if(catID != 0) {
      this.router.navigate([], {queryParams: {cat:catID}} )
    } else {
      this.router.navigate([])
    }
  }

}
