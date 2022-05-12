# Angular-boas-praticas-form
## Instalando o angular
- npm i -g @angular/cli
- ng new nomeDoProjeto --strict
- npm install bootsrap font-awesome
- incorporando o boostrap no arquivo
 ````
  "styles": [
              "src/styles.scss",
              "./node_modules/bootstrap/dist/css/bootstrap.min.css",
              "./node_modules/font-awesome/css/font-awesome.css"
              
            ],
 `````
 - Criando o modulo e a rota
 ````
 ng g m home --routing -d
 `````
 
 ## Rotas lazing laod
 - remover o modulo do modulo principal
 - rota principal
 ````
 const routes: Routes = [
  {path:'', pathMatch:'full', redirectTo:'home'},
  {path:'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {path:'animal', loadChildren: () => import('./animais/animais.module').then((m) => m.AnimaisModule)},
];
 `````
 - rotas da home
 ````
 const routes: Routes = [
  {path:'', component:HomeComponent, children: [
    {
      path:'', component:LoginComponent
    },
    {
      path:'novoUsuario', component:NovoUsuarioComponent
    }
  ]},
];
 `````
 ## Medoto para fazer login
 ````
 login(){
    this.service.autheticar(this.usuario, this.senha).subscribe(() => {
      this.router.navigate(['/animal'])
    }, (error) => {
      alert('Usuario ou senha inválida')
      console.log(error);
    });
  }
 `````
 
 ## Validação de formulário
 ````
 <form #f="ngForm">
   <input type="text" placeholder="Nome" required #error="ngModel">
   <div *ngIf="error.invalid && error.touched">Esse campo é obrigatorio</div>
   <button [disabled]="f.invalid" [routerLink]="['/home/novoUsuario']">Enviar</button>
 </form>
 `````
 
 ## 
 
 
 
 
 
