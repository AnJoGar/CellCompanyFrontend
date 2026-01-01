import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReporteInterface } from '../../../interfaces/reporte';
import { ReportService } from '../../../services/Reporte-service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
Chart.register(...registerables);

@Component({
  selector: 'app-dasboard-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatProgressBarModule
  ],
  templateUrl: './dasboard-component.html',
  styleUrl: './dasboard-component.css',
})
export class DasboardComponent implements OnInit, AfterViewInit {
  listaReportes: ReporteInterface[] = [];
  
  // Totales para las tarjetas
  totalFinanciado = 0;
  totalPendiente = 0;
  totalRecaudado = 0;
  cantidadCreditos = 0;

  private chartRadar: Chart | null = null;
  private chartBarras: Chart | null = null;

  constructor(private _reporteServicio: ReportService) { }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  ngAfterViewInit(): void {
    // Los gráficos se generarán después de obtener los datos
  }

  obtenerDatos() {
    this._reporteServicio.reporteCreditosSinFecha().subscribe({
      next: (res) => {
        if (res.status) {
          this.listaReportes = res.value;
          this.calcularKpis();
          // Esperar un momento para que el DOM se actualice
          setTimeout(() => {
            this.generarGraficoRadar();
            this.generarGraficoVentas();
          }, 100);
        }
      },
      error: (e) => console.error("Error al obtener reporte", e)
    });
  }

  calcularKpis() {
    this.cantidadCreditos = this.listaReportes.length;
    this.totalFinanciado = this.listaReportes.reduce((acc, item) => acc + item.montoTotal, 0);
    this.totalPendiente = this.listaReportes.reduce((acc, item) => acc + item.montoPendiente, 0);
    this.totalRecaudado = this.listaReportes.reduce((acc, item) => acc + item.abonadoTotal, 0);
  }

  generarGraficoRadar(): void {
    const conteo = this.listaReportes.reduce((acc: any, item) => {
      acc[item.estadoCredito] = (acc[item.estadoCredito] || 0) + 1;
      return acc;
    }, {});

    const ctx = document.getElementById('chartRadarEstados') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el canvas chartRadarEstados');
      return;
    }

    // Destruir gráfico anterior si existe
    if (this.chartRadar) {
      this.chartRadar.destroy();
    }

    this.chartRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(conteo),
        datasets: [{
          label: 'Cantidad de Créditos',
          data: Object.values(conteo),
          fill: true,
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          borderColor: '#3f51b5',
          pointBackgroundColor: '#3f51b5',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3f51b5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        elements: { 
          line: { 
            borderWidth: 3 
          } 
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: { 
          legend: { 
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }

  generarGraficoVentas(): void {
    const dataTiendas = this.listaReportes.reduce((acc: any, item) => {
      acc[item.nombreTienda] = (acc[item.nombreTienda] || 0) + item.montoTotal;
      return acc;
    }, {});

    const ctx = document.getElementById('chartBarrasTiendas') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el canvas chartBarrasTiendas');
      return;
    }

    // Destruir gráfico anterior si existe
    if (this.chartBarras) {
      this.chartBarras.destroy();
    }

    this.chartBarras = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(dataTiendas),
        datasets: [{
          label: 'Venta Total ($)',
          data: Object.values(dataTiendas),
          backgroundColor: '#ff4081',
          borderRadius: 5,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: { 
          legend: { 
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.x !== null) {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.parsed.x);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: { 
            grid: { display: true },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          },
          y: { 
            grid: { display: false }
          }
        }
      }
    });
  }

  exportarReporte() {
    // Implementar lógica de exportación
    console.log('Exportando reporte...');
  }

  ngOnDestroy(): void {
    // Limpiar gráficos al destruir el componente
    if (this.chartRadar) {
      this.chartRadar.destroy();
    }
    if (this.chartBarras) {
      this.chartBarras.destroy();
    }
  }
}