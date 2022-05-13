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
 
 ## Formulario reativo
 ````
 novoUsuario!: FormaGroup
 
 constructor(private formBuilder: FormBuilder){}
 
 ngOnInit(): void {
   this.novoUsuario = this.formBuilder.group({
     email: ['', [
     Validators.required
     ]],
     fullName: ['', [minuculoValidator]], // validação criada por mim
     userName: ['' [this.usuarioService.usuariojaexiste()]], // verificação assicrona
     password: [''],
   },
   // validação do formulario
   {
     validators: [usuarioSenhaIguaisValidator]
   }
   )
 }
 
 cadastrar(){
 // getRawValue() returna um objeto somente com o estado das variaveis
  const novoUsuario = this.novoUsuario.getRawValue() as novoUsuario;
 }
 `````
 
 ## Formulario reativo
 ````
 <form [formGroup]="novoUsuario" (ngSubmit)="cadastrar()">
   <input type="text" placeholder="Nome" required formControlName="email">
   <input type="text" placeholder="Nome" required formControlName="fullName">
   <input type="text" placeholder="Nome" required formControlName="userName">
   <input type="password" placeholder="Nome" required formControlName="password">
   <div
   *ngIf="task.get('text')?.errors?.['required'] && task.get('text')?.touched"
   >Esse campo é obrigatorio</div>
   // tratando a validação criada por mim
     <div
   *ngIf="task.get('userName')?.errors?.minuscula && task.get('userNAme')?.touched"
   >Esse campo é obrigatorio</div>
   // validação assincrona
    <div
   *ngIf="task.get('userName')?.errors?.usuarioExiste"
   >Usuario já existe</div>
   // validação de formulario
    <div
   *ngIf="task.errors?.senhaIgualUsuario"
   >Usuario já existe</div>
 </form>
 `````
 
 ## validação customizada
 - Criar um arquivo ts
 ````
 export function minusculoValidator(control: AbstractControl){
   const valor = control.value as string
   if(valor == valor.toLowerCase()){
   return { minusculo: true } // retornando um objeto. o nome minusculo e o que eu passo no html
   }else{
   return null
   }
 }
 `````
 
## Validação assincrona. Usuario á existe na base
- no service main
````
verificarUsuario(nome: string){
  return this.http.get(baseUrl,name)
}
`````
- criar um service
````
  constructor(private service: Servico){}
  
  usuariojaexite(){
    return (control: AbstractControl) => {
    // recebendo o que o usuario digitou e convertendo para uma requisiçao backend
     return control.valueChanges.pipe(
       switchMap((nome) => this.service.verificarUsuario(nome)
     ),
     // fazendo a troca de resultado
     map((usuarioExiste) => usuarioExiste ? {usuarioExiste: true} : null),
     // depois da requisição ele fecha o fluxo
     first()
     )
    }
  }
``````
## Senha e nome não podem ser iguais
- Criar um arquivo ts
````
export function usuarioSenhaIguaisValidator(formGroup: FormGroup){
    const username = formGroup.get('userName')?.value ?? ''; // ?? quer dizer q ele retorna vazio se o valor for null
    const username = formGroup.get('userName')?.value ?? ''; 
    
    if(username.trim() + password.trim()){
      return username !== password ? null : { senhaIgualUsuario: true}
    }else{
    return null // se os dois estiverem vazios retorna null
    }
}
`````

## Token
- service
````
// fora da classe
const KEY = 'token';

// dentro da classe
retonaToken(){
  return localStore.getItem(KEY) ?? '';
}

salvarToken(token: string){
  localStore.setItem(KEY, token);
}

excluirToken(){
 localStore.removeItem(KEY);
}

possuiToken(){
 return !!this.retornaToken
}

`````

## Servico de usuario
- interface
````
export interface Usuario{
  id: number
  email: string
  password: tring
}
`````
- service usuario
````
// recebe e envia informação
private usuarioSubject = new BehaviorSubject<Usuario>({}); // BehaviorSubject -> guarda o estado e envia o ultimo

constructor(private tokenService: TokenService){
  // se ele já tem o usuario no localStore quanod eu chamo o metod salvar
  if(this.tokenService.possuiToken()){
    this.decodifica()
  }
}

private decodifica(){
// pegando o token
  const token = this.tokenService.retornToken();
  // decodificando
  const usuario = jwt_decode(token) as Usuario // jwt_decode biblioteca baixada por mim
  // enviando as informações para tds que se escreveram
  this.usuarioSubject.next(usuario);
}

//returnado o subjecto mas não vou envia o subjecto para elementos de fora não manipula ele
retornaUsuario(){
  return this.usuarioSubject.asObservable();
}

salvarToken(token: string){
  this.tokenService.salvarToken(token);
  this.decodifica();
}

logout(){
this.tokenService.excluiToken();
this.usuarioSubject.next({})
}

estaLogado(){
return this.tokenService.possuiToken()
}
`````

## Service de Autenticação
- service de http
````
// função para pegar o header e salvar o token
// Observable<HttpResponse<any> quer dizer que vou pegar toda a requisição
autenticar(usuario: string, string: string): Observable<HttpResponse<any>>{
  return this.httpClient.post(
  url, 
  {userName: usuario, password: senha},
  {observe: 'response'}
  ).pipe(// toda vez que fizer uma requisição eu quero salvar o token
  // uso o tap quando não estou alterando o resulto
  tap((res) =>{
  // pegando o token que está no header
  const authToken = res.headers.get('x-access-token') ?? '';
  this.usuarioService.salvarToken(authToken)
  })
  )
}
`````

## Criando cabeçalho para saber se o usuario esta logado
- ts cabeçalho
````
user$ = this.usuarioService.retornaUsuario();

constructor(private usuarioService: UsuarioService, private router: Router){}

logout(){
  this.usuarioService.logout();
  this.router.navigate(['login'])
}
`````
- html
````
<header class="sticky-top">
 <nav *ngIf="user$ | async as user">
   <div *ngIf="user.name; else login>
     <a>
      {{ user.name }}
     </a>
     <a (click)="Logout()">
      Logout
     </a>
   </div>
 </nav>

 <ng-template #login>
   <span class="navbar-text">
    <a [routerLink="['']">Login</a>
   </span>
 </ng-template>
</header>
`````




















 
 
 
