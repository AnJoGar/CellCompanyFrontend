import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
//import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../../services/usuario';
import { UsuarioModel } from '../modal/usuario-model/usuario-model';
import { Usuario } from '../../../interfaces/usuario';
//import { ModalEliminarUsuarioComponent } from '../modales/modal-eliminar-usuario/modal-eliminar-usuario.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import {  MatPaginatorModule } from '@angular/material/paginator'; 
//import { ModalVerUsuarioComponent } from 'src/app/components/pages/modales/modal-ver-usuario/modal-ver-usuario.component';
// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; // ⭐ AGREGAR ESTO
import { CommonModule } from '@angular/common'; 
import { ModalEliminarUsuario } from '../modal/modal-eliminar-usuario/modal-eliminar-usuario';
import { ModalVerUsuario } from '../modal/modal-ver-usuario/modal-ver-usuario';
import { ModalUsuarioSinV } from '../modal/modal-usuario-sin-v/modal-usuario-sin-v';
@Component({
  selector: 'app-usuario-component',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
   CommonModule, // ⭐ AGREGAR
    FormsModule,
   MatPaginatorModule  ],
  templateUrl: './usuario-component.html',
  styleUrl: './usuario-component.css',
})
export class UsuarioComponent {
 estadoFiltro: string = '';
  displayedColumns: string[] = ['idUsuario','nombreApellidos', 'correo', 'rolDescripcion','estado','acciones','acc', 'consultar'];
  ELEMENT_DATA: Usuario[]=[];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  isActivoChecked: boolean = true;
  isNoActivoChecked: boolean = false;
  radioButtonSeleccionado = 'Todos';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _usuarioServicio: UsuarioService
  )
  { 
  }
  ngOnInit(): void {
    this.filtro = 'todos'; 
   
    this.mostrarUsuarios();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }
  applyFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.searchValue;
  }

  searchValue: string = '';
  onSearchInput() {
    if (this.searchValue === '') {
      this.filtro = 'todos';
      this.applyFilterEstado();
    }
  }

  mostrarUsuarios() {
    this._usuarioServicio.ObtenerUsuarios().subscribe({
      next: (data) => {
        if(data.status)
          this.dataSource.data = data.value;
        else
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }
  filtro: string = 'todos';

defaultFilterPredicate(data: Usuario, filter: string): boolean {
  const filterValue = filter.trim().toLowerCase();
  if (this.filtro === 'no activo') {
    return data.esActivo === 0 && (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue)
      
    );
  } else if(this.filtro === 'todos'){
    return (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue) 
    );
  }else if(this.filtro === 'activo' || ''){
    return (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue)
    );
  }else{
    return (
      data.nombreApellidos.toLowerCase().includes(filterValue) ||
      data.rolDescripcion.toLowerCase().includes(filterValue) ||
      data.correo.toLowerCase().includes(filterValue) ||
      data.id.toFixed(2).includes(filterValue)
    );
  }
  return true;
}

applyFilterEstado() {
  switch (this.filtro) {
    case 'todos':
      this.dataSource.filterPredicate = this.defaultFilterPredicate;
      this.dataSource.filter = '';
      this.mostrarUsuarios();
      break;
    case 'no activo':
      this.dataSource.filterPredicate = (data: Usuario, filter1: string) => {
        const filterValue = filter1.toLowerCase();
        return data.esActivo === 0;
      };
      this.dataSource.filter = 'no activo'; 
    this.dataSource.filterPredicate = this.defaultFilterPredicate;
      break;
    case 'activo':
      this.dataSource.filterPredicate = (data: Usuario, filter1: string) => {
        const filterValue = filter1.toLowerCase();
        return data.esActivo === 1;
      };
      this.dataSource.filter = 'activo';
      this.dataSource.filterPredicate = this.defaultFilterPredicate;
      break;
    default:
      this.dataSource.filter = '';
      this.dataSource.filterPredicate = this.defaultFilterPredicate;
      break;
  }
  if (this.filtro !== 'todos' && this.dataSource.filteredData.length === 0) {
    console.log('No existe usuario con el filtro seleccionado.');
  }
}
  mostrarAlerta(mensaje:string,tipo:string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration:3000
    });
  }

  agregarUsuario() {
    this.dialog.open(UsuarioModel, {
        disableClose: true
      }).afterClosed().subscribe(result => {
        if (result === "agregado") {
          this.mostrarUsuarios();
        }
      });
  }

  agregarUsuarioSinV() {
    this.dialog.open(ModalUsuarioSinV, {
        disableClose: true
      }).afterClosed().subscribe(result => {
        if (result === "agregado") {
          this.mostrarUsuarios();
        }
      });
  }

  editarUsuario(usuario: Usuario) {
    this.dialog.open(ModalUsuarioSinV, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(result => {
      if (result === "editado")
        this.filtro = 'todos'; 
         this.applyFilterEstado();
         this.searchValue = '';
    });
  }

 
  eliminarU(usuario:Usuario){
Swal.fire({
  title:"Desea eliminar el usuario",
  text:usuario.nombreApellidos,
  icon:'warning',
  confirmButtonColor:'#3085d6',
showCancelButton:true,
cancelButtonColor: '#3085d6',

}).then(result => {
  if(result.isConfirmed)
  this._usuarioServicio.EliminarUsuario(usuario.id).subscribe({
    next: (data) =>{
      if (data.status) {
        this.mostrarAlerta("El usuario fue eliminado", "Listo!")
        this.mostrarUsuarios();
      } else {
        this.mostrarAlerta("No se pudo eliminar el usuario", "Error");
      }
    },
      error: (e) => {}
    })
  })
  }


    eliminarUsuario(usuario: Usuario) {
    this.dialog.open(ModalEliminarUsuario, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(result => {
      if (result === "eliminar") {
        this._usuarioServicio.EliminarUsuario(usuario.id).subscribe({
          next: (data) => {
            if (data.status) {
              this.mostrarAlerta("El usuario fue eliminado", "Listo!")
              this.mostrarUsuarios();
            } else {
              this.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error: (e) => {
          },
          complete: () => {
          }
        })
      }
    });
  }

  verUsuario(usuario: Usuario) {
    this.dialog.open(ModalVerUsuario, {
      disableClose: true,
      data: { usuario }
    }).afterClosed().subscribe(result => {
    });
  }

}
