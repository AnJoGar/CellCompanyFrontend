import { Component, OnInit, AfterViewInit,ChangeDetectorRef } from '@angular/core';
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
export class DasboardComponent implements OnInit, AfterViewInit, AfterViewInit {
  listaReportes: ReporteInterface[] = [];
  
  // Totales para las tarjetas
  totalFinanciado = 0;
  totalPendiente = 0;
  totalRecaudado = 0;
  cantidadCreditos = 0;

  private chartRadar: Chart | null = null;
  private chartBarras: Chart | null = null;

  constructor(private _reporteServicio: ReportService,
    private cdr: ChangeDetectorRef
  ) { }

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
          // Fuerza a Angular a renderizar los nuevos valores en las tarjetas ($8,782.00 en lugar de $0.00)
          this.cdr.detectChanges();
          // Esperar un momento para que el DOM se actualice
          setTimeout(() => {
            this.generarGraficoLineasCreditos();
            this.generarGraficoVentas();
             this.generarGraficoDonaCumplimiento(); 
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

  
generarGraficoRadar1(): void {
  // Agrupar créditos por mes
  const creditosPorMes: { [key: string]: number } = {};
  
  this.listaReportes.forEach(item => {
    // Parsear la fecha del crédito
    const fecha = new Date(item.fechaCreditoStr);
    // Formato: "Ene 2025", "Feb 2025", etc.
    const mesAnio = fecha.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
    
    creditosPorMes[mesAnio] = (creditosPorMes[mesAnio] || 0) + 1;
  });

  // Ordenar los meses cronológicamente
  const mesesOrdenados = Object.entries(creditosPorMes)
    .sort((a, b) => {
      const fechaA = new Date(a[0]);
      const fechaB = new Date(b[0]);
      return fechaA.getTime() - fechaB.getTime();
    })
    .reduce((acc, [mes, cantidad]) => {
      acc[mes] = cantidad;
      return acc;
    }, {} as { [key: string]: number });

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
      labels: Object.keys(mesesOrdenados),
      datasets: [{
        label: 'Créditos Dados por Mes',
        data: Object.values(mesesOrdenados),
        fill: true,
        backgroundColor: 'rgba(23, 120, 158, 0.2)', // Color de tu sistema
        borderColor: '#17789e',
        pointBackgroundColor: '#17789e',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#17789e',
        pointRadius: 5,
        pointHoverRadius: 7
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
            stepSize: 1,
            font: {
              size: 12
            }
          },
          pointLabels: {
            font: {
              size: 13,
              weight: 'bold'
            }
          }
        }
      },
      plugins: { 
        legend: { 
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.r} crédito${context.parsed.r !== 1 ? 's' : ''}`;
            }
          }
        }
      }
    }
  });
}

generarGraficoLineasCreditos(): void {
  // Agrupar créditos por mes
  const creditosPorMes: { [key: string]: number } = {};
  
  this.listaReportes.forEach(item => {
    // Parsear correctamente según el formato de tu fecha
    let fecha: Date;
    
    // Si viene en formato DD/MM/YYYY
    if (item.fechaCreditoStr.includes('/')) {
      const [dia, mes, anio] = item.fechaCreditoStr.split('/');
      fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
    } else {
      // Si viene en formato ISO
      fecha = new Date(item.fechaCreditoStr);
    }
    
    // Validar que la fecha sea válida
    if (isNaN(fecha.getTime())) {
      console.warn('Fecha inválida:', item.fechaCreditoStr);
      return;
    }
    
    // Formato: "ene. 2025"
    const mesAnio = fecha.toLocaleString('es-ES', { 
      month: 'short', 
      year: 'numeric' 
    }).replace('.', '');
    
    creditosPorMes[mesAnio] = (creditosPorMes[mesAnio] || 0) + 1;
  });

  console.log('Créditos por mes:', creditosPorMes); // Debug

  // Ordenar cronológicamente
  const mesesOrdenados = Object.entries(creditosPorMes)
    .sort((a, b) => {
      // Parsear de vuelta para ordenar correctamente
      const [mesA, anioA] = a[0].split(' ');
      const [mesB, anioB] = b[0].split(' ');
      
      const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                     'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      
      const fechaA = new Date(parseInt(anioA), meses.indexOf(mesA.toLowerCase().substring(0, 3)));
      const fechaB = new Date(parseInt(anioB), meses.indexOf(mesB.toLowerCase().substring(0, 3)));
      
      return fechaA.getTime() - fechaB.getTime();
    })
    .reduce((acc, [mes, cantidad]) => {
      acc[mes] = cantidad;
      return acc;
    }, {} as { [key: string]: number });

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
    type: 'line',
    data: {
      labels: Object.keys(mesesOrdenados),
      datasets: [{
        label: 'Créditos Dados por Mes',
        data: Object.values(mesesOrdenados),
        borderColor: '#17789e',
        backgroundColor: 'rgba(23, 120, 158, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#17789e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#17789e',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold'
            },
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              const cantidad = context.parsed.y;
              return `${cantidad} crédito${cantidad !== 1 ? 's' : ''} otorgado${cantidad !== 1 ? 's' : ''}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            //drawBorder: false
          }
        },
        x: {
          ticks: {
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
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

  private chartLineas: Chart | null = null;

generarGraficoEvolucionVentas(): void {
  // 1. Agrupar montos por mes
  const ventasPorMes: { [key: string]: number } = {};
  
  this.listaReportes.forEach(item => {
    // Extraemos el mes y año (asumiendo formato DD/MM/YYYY o ISO)
    const fecha = new Date(item.fechaCreditoStr);
    const mesAnio = fecha.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
    
    ventasPorMes[mesAnio] = (ventasPorMes[mesAnio] || 0) + item.montoTotal;
  });

  const ctx = document.getElementById('chartRadarEstados') as HTMLCanvasElement; // Usamos el mismo id o uno nuevo
  if (!ctx) return;

  if (this.chartLineas) this.chartLineas.destroy();

  this.chartLineas = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(ventasPorMes),
      datasets: [{
        label: 'Ventas Mensuales ($)',
        data: Object.values(ventasPorMes),
        borderColor: '#17789e', // El azul de tu sistema
        backgroundColor: 'rgba(23, 120, 158, 0.1)',
        fill: true,
        tension: 0.4, // Curva suave para un look más moderno
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false } // El título ya dice qué es
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => '$' + value.toLocaleString()
          }
        }
      }
    }
  });
}


private chartDona: Chart | null = null;
generarGraficoDonaCumplimiento(): void {
    const conteo = this.listaReportes.reduce((acc: any, item) => {
      acc[item.estadoCredito] = (acc[item.estadoCredito] || 0) + 1;
      return acc;
    }, {});

    const ctx = document.getElementById('chartDonaCumplimiento') as HTMLCanvasElement;
    if (!ctx) return;
    if (this.chartDona) this.chartDona.destroy();

    this.chartDona = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(conteo),
        datasets: [{
          data: Object.values(conteo),
          backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'],
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}