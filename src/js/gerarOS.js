const KEY_BD = '@ossestudo'
const KEY_BD_TP_SERVICO ='@tiposervicossestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    oss:[],
    observacao:[]
}

let mostrar

var FILTRO = ''


function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.oss;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( os => {
                return expReg.test( os.equipamento ) || expReg.test( os.dataParada ) || expReg.test( os.horaParada ) || expReg.test( os.dataPrevista ) ||expReg.test( os.horaParada ) ||expReg.test( os.id_OM ) ||expReg.test( os.equipe) 
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.equipamento < b.equipamento ? -1 : 1
            })
            .map( os => {
                return `<tr>
                        <td>${os.id}</td>
                        <td>${os.equipamento}</td>
                        <td>${os.dataParada}</td>
                        <td>${os.horaParada}</td>
                        <td>${os.dataPrevista}</td>
                        <td>${os.horaPrevista}</td>
                        <td>${os.id_OM}</td>
                        <td>${os.equipe}</td>
                        <td>
                            <button onclick='visualizar("cadastro",false,${os.id})'>
                                <i class=" fa fa-edit"></i>
                            </button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${os.id})'>
                             <i class=" fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertOs(equipamento, dataParada, horaParada, dataPrevista, horaPrevista, id_OM, equipe, obsOs){
    const id = listaRegistros.ultimoIdGerado + 1;
    console.log("obsOs: "+ obsOs)
    let observacao = [];
    if (obsOs.trim().length>0) {
        var data = new Date();
        var obs = obsOs.trim().replace(/\r?\n/g, '<br/>');
        observacao.push({obs, data})
    }
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.oss.push({
        id, equipamento, dataParada, horaParada, dataPrevista, horaPrevista, id_OM, equipe, observacao
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editOs(id, equipamento, dataParada, horaParada, dataPrevista, horaPrevista, id_OM, equipe, obsOs){
    var os = listaRegistros.oss.find( os => os.id == id );
    let observacao = os.observacao;
    if (obsOs.trim().length>0) {
        var data = new Date();
        var obs = obsOs.trim().replace(/\r?\n/g, '<br/>');
        observacao.push({obs, data})
    }
    os.equipamento = equipamento;
    os.dataParada = dataParada;
    os.horaParada = horaParada;
    os.dataPrevista = dataPrevista;
    os.horaPrevista = horaPrevista;
    os.id_OM = id_OM; 
    os.equipe = equipe;
    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteOs(id){
    listaRegistros.oss = listaRegistros.oss.filter( os => {
        return os.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteOs(id)
    }
}


function limparEdicao(){
    document.getElementById('id').value = ''
    document.getElementById('equipamento').value = ''
    document.getElementById('dataParada').value = ''
    document.getElementById('horaParada').value = ''
    document.getElementById('dataPrevista').value = ''
    document.getElementById('horaPrevista').value = ''
    document.getElementById('id_OM').value = ''
    document.getElementById('equipe').value = ''
    document.getElementById('obsOs').value = ''
}

function visualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) {
            limparEdicao()
            document.getElementById('historico').style.display = 'none';
        }
        if(id){
            limparEdicao()
            
            document.getElementById('historico').style.display = 'block';
            const os = listaRegistros.oss.find( os => os.id == id )
            if(os){
                 document.getElementById('id').value = os.id
                document.getElementById('equipamento').value = os.equipamento
                document.getElementById('dataParada').value = os.dataParada
                document.getElementById('horaParada').value = os.horaParada
                document.getElementById('dataPrevista').value = os.dataPrevista
                document.getElementById('horaPrevista').value = os.horaPrevista
                document.getElementById('id_OM').value = os.id_OM
                document.getElementById('equipe').value = os.equipe
                carregarObservacoes(os.observacao);
            }
        }
        carregarTipoServico();

        document.getElementById('equipamento').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        equipamento: document.getElementById('equipamento').value,
        dataParada: document.getElementById('dataParada').value,
        horaParada: document.getElementById('horaParada').value,
        dataPrevista: document.getElementById('dataPrevista').value,
        horaPrevista: document.getElementById('horaPrevista').value,
        id_OM: document.getElementById('id_OM').value,
        equipe: document.getElementById('equipe').value,
        obsOs: document.getElementById('obsOs').value,
    }
    console.log("OBS222: " + data.obsOs);
    if(data.id){
        editOs(data.id, data.equipamento, data.dataParada, data.horaParada, data.dataPrevista , data.horaPrevista, data.id_OM, data.equipe, data.obsOs)
    }else{
        insertOs( data.equipamento, data.dataParada, data.horaParada, data.dataPrevista, data.horaPrevista, data.id_OM, data.equipe, data.obsOs )
    }
}

function limpaCombo(){
    const select = document.getElementById('id_OM')
    console.log("tamanho combo + "+ select.length);
    for(i = select.length-1;  i >= 0 ; i--) {
        select.remove(i);
        console.log("removeu " + i); 
    }
}

function carregarTipoServico(){

    var listaTipoServico = {
        ultimoIdGerado:0,
        tipoServico:[]
    }
    var data_temp = localStorage.getItem(KEY_BD_TP_SERVICO)
    if(data_temp){
        listaTipoServico = JSON.parse(data_temp)
    }
    limpaCombo();
    const select = document.getElementById('id_OM')
    if(select){
        var data = listaTipoServico.tipoServico;
        var index=0;
        var opt0 = document.createElement("option");
                opt0.value = "0";
                opt0.text = "";
                select.add(opt0, select.options[index]);
        index++;
        data = data
            .sort( (a, b) => {
                return a.om < b.om ? -1 : 1
            })
            .map( tpServico => {
                console.log(" tipo servico: " + tpServico.om + " " + index);
                var opt1 = document.createElement("option");
                opt1.value = tpServico.om;
                opt1.text = tpServico.om;
                select.add(opt1, select.options[index]);
                index++;
                //return `<option value="${tpServico.om}"><strong>${tpServico.om}</strong></option>`
            } )
        //select.innerHTML = data.join('')
    }
}

function carregarObservacoes(obsOs){
    const msgDiv = document.getElementById('menssagens');
    if(msgDiv){
        var data = obsOs;
        data = data
            .map( obs => {
                return `<div class="body">
                <div class="content">
                    ${obs.obs}
                    <br>
                    <br>
                    <br>
                    <hr>
                    ${dataFormatada(obs.data)}
                    <br>
                </div>
            </div>`
            });
        msgDiv.innerHTML = data.join('');
    }
}

function dataFormatada(valueDate){
var data = new Date(valueDate);    

// Guarda cada pedaço em uma variável
var dia     = data.getDate();           // 1-31
var dia_sem = data.getDay();            // 0-6 (zero=domingo)
var mes     = data.getMonth();          // 0-11 (zero=janeiro)
var ano2    = data.getYear();           // 2 dígitos
var ano4    = data.getFullYear();       // 4 dígitos
var hora    = data.getHours();          // 0-23
var min     = data.getMinutes();        // 0-59
var seg     = data.getSeconds();        // 0-59
var mseg    = data.getMilliseconds();   // 0-999
var tz      = data.getTimezoneOffset(); // em minutos

// Formata a data e a hora (note o mês + 1)
var str_data = dia.toString().padStart(2, '0') + '/' + (mes+1).toString().padStart(2, '0') + '/' + ano4;
var str_hora = hora.toString().padStart(2, '0') + ':' + min.toString().padStart(2, '0') + ':' + seg.toString().padStart(2, '0');

return str_data + ' ' + str_hora;

// Mostra o resultado
alert('Hoje é ' + str_data + ' às ' + str_hora);
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })
})