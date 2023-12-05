# Manual de instalação 

Neste manual, é primordial que possua acesso as permissões de gerenciamento do repositório Git devido a forma de deploy que será utilizado. Pois será gerado uma chave privada/publica no servidor a qual será utilizada para fornecer permissão de acesso, isso ocorre devido a recentes restrições relacionadas ao acesso de repositórios no Github serem realizados apenas via SSH.

#### Observações

1. Note que durante este manual iremos usar chaves (`{` e `}`) para envolver determinado item, uma informação envolvida por chaves deve ser totalmente substituida (incluindo as chaves) pelo valor que ela indica, por exemplo:
   * `{email}` => `emailaqui@gmail.com`
   * `{ip}` => `192.168.0.31`
   * `{usuario}@{ip}` => `ifsp@192.168.0.31` 
2. Nos comandos apresentados, assim como praticamente todo exemplo de comando Linux encontrado na internet, os comandos a serem executados durante a configuração são mostrados nas linhas que começam com o caractere `$`, enquanto as linhas com o caractere `>` representam as saídas destes comandos
3. Em casos onde existam palavras envolvidas por `[ ]`, deve-se notar que estas estão representando uma ação. Por exemplo `[Enter]`quer dizer que o usuário deve apenas apertar a tecla enter, enquanto `[Digite a senha]` que neste momento ele deve inserir a senha de acesso/cadastro.
4. Este manual foi escrito considerando que o usuário possui um conhecimento básico do sistema operacional linux. Normalmente este conhecimento é ensinado em algumas aulas de `Redes 1~2`, `Linguagem de montagem` ou alguma outra aula do Kleber, Ricardo ou Cláudio.
5. Recomendo realizar o processo de instalação em um Ubuntu Server LTS, a versão durante a escrita deste manual é a 18.04. Já que pode haver modificações nos comandos utilizados, ou outros problemas relacionado ao suporte de determinada tecnologia utilizada.

<div style="page-break-after: always;"></div>

## 1. Acesso ao código fonte

No momento da escrita deste manual de instalação `(13/12/2021)`, o repositório com o código fonte do sistema pode ser acessado pela URL `https://github.com/Fabrica-de-Software-Academica-IFSP-PEP/gerenciaRED` caso seu usuário do Github possui as devidas permissões a organização/repositório.

1. Acessar o servidor via SSH com o comando `ssh {usuario}@{ip}`, utilizando o usuário e endereço IP fornecido pela equipe de TI (normalmente é necessário acesso a VPN para que possa conectar ao servidor, por favor confira o tutorial de uso enviado no email pela equipe de TI)

2. Logado no sistema, devemos primeiramente garantir que algumas coisas estão instaladas, para isso é possível utilizar o segundo comando caso esteja utilizando o sistema operacional Ubuntu:
```bash
   $ sudo apt install git
   > Saída do processo de instalação
   [Pressionar Y e enter para confirmar a instalação]
   ```

3. Deve realizar a geração de uma chave SSH

   1. Gerar uma chave ssh

      ```bash
      $ ssh-keygen -t ed25519 -C "{email}"
      > Generating public/private algorithm key pair.
      > Enter a file in which to save the key (/home/you/.ssh/algorithm): [Pressionar enter]
      > Enter passphrase (empty for no passphrase): [Digite uma senha]
      > Enter same passphrase again: [Digite uma senha]
      ```

      * Ao requerer um local para inserir o arquivo, deve apenas apertar enter
      * Então caso deseje, pode digitar uma senha e confirmala ou apenas apertar enter para deixar sem nenhuma senha

   2. Iniciar o `ssh-agent` em segundo plano

      ````bash
      $ eval "$(ssh-agent -s)"
      > Agent pid 59566
      ````

   3. Adicionar a chave SSH privada, em casos de ter criado com um nome diferente, deve substituir `id_ed25519` no comando com o nome da chave.

      ```bash
      $ ssh-add ~/.ssh/id_ed25519
      ```

4. Copiar a chave pública localizada em `~/.ssh/id_ed25519.pub`. (Pode ser feito usando um `cat ~/.ssh/id_ed25519.pub` e copiando a saida do comando)

   - **LEMBRE DE COPIAR A CHAVE PÚBLICA (ARQUIVO QUE TERMINA COM `.PUB`)**

   <div style="page-break-after: always;"></div>

5. Com a chave SSH gerada, deve-se realizar o seu cadastro no Github, para isso siga a sequencia de passos demonstrada na imagem a seguir:
    ![Imagem1](./imagens/Imagem1.png)

6. Nesta segunda página, deve se preenchar as informações da seguinte maneira:

   ![Imagem2](./imagens/Imagem2.png)

7. Após preencher as informações, a chave ssh pode ser adicionada apenas ao clicar no botão verte `Add key`, ou em português `Adicionar chave`

<div style="page-break-after: always;"></div>

Apartir deste momento, já deve ser possível realizar o clone do projeto no servidor através do comando abaixo

```bash
$ git clone git@github.com:Fabrica-de-Software-Academica-IFSP-PEP/gerenciador-eventos.git
ou
$ git clone {urlSSH}
> Cloning into 'gerenciador-eventos'...
> The authenticity of host 'github.com (20.201.28.151)' can't be established.
> ECDSA key fingerprint is SHA256:p2QAMXNIC1TJYWeIOttrVc98/R1BUFWu3/LiyKgUfQM.
> Are you sure you want to continue connecting (yes/no/[fingerprint])? [Digitar yes]
Warning: Permanently added 'github.com,20.201.28.151' (ECDSA) to the list of known hosts.
> remote: Enumerating objects: 12245, done.
> emote: Counting objects: 100% (5847/5847), done.
> remote: Compressing objects: 100% (2737/2737), done.
> remote: Total 12245 (delta 3671), reused 4641 (delta 2678), pack-reused 6398
> Receiving objects: 100% (12245/12245), 9.40 MiB | 4.42 MiB/s, done.
> Resolving deltas: 100% (7578/7578), done.
```

## 2 Instalação do Node.js

No momento de escrita deste manual (05/12/2023), estamos utilizando o Node.js.

```bash
$ sudo apt-get install -y nodejs
```

- Para outras versões, consulte este link https://github.com/nodesource/distributions/blob/master/README.md

1. Instalação das dependências

   - Para instalar as dependências do projeto deve ser realizado o acesso em duas pastas deste, sendo elas `backend` e `frontend`

   - Em cada uma destas pastas devem ser rodados o comando `npm i`

## 3 Configuração do projeto

## 3.1 **Backend**

1. Acessar a pasta do backend, onde ela está localizada

2. Criar um .env e adicionar estas informações:

```bash
ACCESS_TOKEN_SECRET=tokensecret
NODE_ENV=dev
BACKEND_PORT=3333
DATABASE_URL="mysql://root:senha@localhost:3306/nomeDoSeuBanco"
```
3. Logo em seguida é necessário installar o prisma. Navegue até a pasta Back-End do projeto e digite o seguinte comando:

```bash
$ npm i @prisma/client
```
4. Logo após a installação digite o próximo comando:

```bash
$ npm install prisma --save-dev
```
- Para mais informações, consulte este link https://www.prisma.io/docs/concepts/components/prisma-client

4. Com os comandos devidamentes utilizados, digitando npx prisma -v é possível visualizar a versão do prisma installado.

5. O prisma possui vários comandos, digitando npx prisma é possível visualizar alguns comando mais utilizados. Após verificar os comandos é possível notar um comando que manda o prisma_schema para o banco de dados, entao digite este comando na pasta do Back-End do projeto:

```bash
$ npx prisma db push
```
- obs: O comando vai funcionar se o .env estiver correto com as suas configurações do banco de dados. 

6. Para iniciar o Back-End utilize o seguinte comando:

```bash
$ npm run dev
```

## 3.2 **Frontend**

1. No Front-end é mais simples, bastas apenas navegar a pasta do Front-End e digitar o seguinte comando:

```bash
$ ng serve
```
