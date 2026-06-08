# FM Finanças

Este é um aplicativo de controle financeiro construído com React Native e Expo. Abaixo você encontrará as instruções de como executar o aplicativo localmente, tanto no seu navegador (Web) quanto no seu celular (Mobile).

## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em seu computador.
Caso você esteja enfrentando problemas com políticas de execução de scripts no PowerShell (comum no Windows), as instruções abaixo utilizam o utilitário `npx` que geralmente contorna esses problemas.

---

## 🌐 Como abrir o app na Web (Navegador)

Para rodar a aplicação diretamente no seu navegador, siga estes passos:

1. Abra o terminal (Prompt de Comando ou PowerShell) e navegue até a pasta do projeto:
   ```bash
   cd "c:\Users\Filipe Gomes\Desktop\Filipe\Trabalho facul app\financas-app"
   ```

2. Execute o seguinte comando:
   ```bash
   npm run web
   ```
   *(Alternativa caso dê erro no PowerShell: `cmd /c npm run web`)*

3. Aguarde o servidor iniciar e processar os arquivos. O aplicativo abrirá automaticamente no seu navegador padrão.
   - Caso não abra automaticamente, acesse: **[http://localhost:8081](http://localhost:8081)**

---

## 📱 Como abrir o app no Celular (QR Code)

Para testar o aplicativo diretamente no seu smartphone (Android ou iOS) usando o aplicativo **Expo Go**:

1. Baixe o aplicativo **Expo Go** na sua loja de aplicativos (Google Play Store ou Apple App Store).

2. Certifique-se de que o seu celular está conectado à **mesma rede Wi-Fi** que o seu computador.

3. Abra o terminal e navegue até a pasta do projeto:
   ```bash
   cd "c:\Users\Filipe Gomes\Desktop\Filipe\Trabalho facul app\financas-app"
   ```

4. Execute o comando principal do Expo:
   ```bash
   npx expo start
   ```
   *(Alternativa caso dê erro no PowerShell: `cmd /c npx expo start`)*

5. Um grande **QR Code** será exibido no terminal.
   - **Android:** Abra o aplicativo Expo Go e selecione "Scan QR code".
   - **iOS:** Abra o aplicativo nativo de Câmera do iPhone e aponte para o QR Code. Um aviso aparecerá para abrir o projeto no Expo Go.

6. O aplicativo será carregado e executado no seu celular!

---

## Dúvidas Comuns
- **O QR Code não carrega no celular:** Verifique se o celular e o computador estão exatamente na mesma rede Wi-Fi (desative dados móveis se necessário). Você também pode precisar alterar o tipo de conexão no Expo (de LAN para Tunnel) apertando `Shift + T` no terminal onde o servidor está rodando.
- **Porta em uso:** Se o erro indicar que a porta `8081` está em uso, feche outros terminais rodando projetos React Native ou Node.
