rm -r dist/

if [ ! -d "/usr/share/nginx/html/red" ]; then
  echo "Pasta: /usr/share/nginx/html/red nao existe. Criando."
  sudo mkdir /usr/share/nginx/html/red
fi

if [ ! -d "node_modules" ]; then
   echo "Node Modules nao existe, gerando.."
   npm
fi

sudo npm run build --prod

sudo rm -r /usr/share/nginx/html/red/*

sudo cp -r dist/* /usr/share/nginx/html/red/