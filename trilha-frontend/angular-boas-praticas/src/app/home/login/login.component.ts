import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticacaoService } from 'src/app/authenticacao/autheticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario = '';
  senha = '';

  constructor(private service: AutheticacaoService,private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    //this.service.autheticar(this.usuario, this.senha).subscribe(() => {
      this.router.navigate(['/animal'])
    //}, (error) => {
    //  alert('Usuario ou senha inválida')
    //  console.log(error);
    //});
  }

}
