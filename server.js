let express = require('express');
let app = express();
app.use(express.static(__dirname + '/dist/PFPerez'));
app.get('/*', (req,resp)=>{
    resp.sendFile(path.join(__dirname + '/dist/PFPerez/index.html'));
});

app.listen(process.env.PORT || 8080);