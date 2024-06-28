import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core/services/users/users.service';
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: {
    enabled: boolean;
  };
  fill: {
    type: string;
  };
  legend: {
    formatter: (val: string, opts: any) => string;
  };
};

@Component({
  selector: 'app-user-distribution-chart',
  templateUrl: './user-distribution-chart.component.html'
})
export class UserDistributionChartComponent implements OnInit {
  @ViewChild("chart") chart: ApexChart;
  chartOptions: Partial<ChartOptions> = {};

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}
  leaveReload() {
    this.showSpinner();

    this.functionOfWorkersChart();

    setTimeout(() => {
      this.hideSpinner();
    }, 1000);
  }

  showSpinner() {
    document.getElementById("reloadWorkersChartButton").innerHTML = `
      <div id="spinner" class="spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  hideSpinner() {
    document.getElementById("reloadWorkersChartButton").innerHTML = `
    <i class="fa-solid fa-arrows-rotate"></i>
    `;
  }
  functionOfWorkersChart(){
    this.userService.getUserDistributionByDepartment().subscribe(res => {
      this.chartOptions = {
        series: res.map(user => user.userCountByDepartment),
        chart: {
          width: 330,
          type: "donut"
        },
        labels: res.map(user => user.departmentName),
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: "gradient"
        },
        legend: {
          formatter: (val, opts) => val + " - " + opts.w.globals.series[opts.seriesIndex]
        },
        responsive: [
          {
            breakpoint: 4804,
            options: {
              chart: {
                width: 330
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
      this.cdr.detectChanges();
    });
  }
  ngOnInit() {
    this.functionOfWorkersChart();
  }
}
