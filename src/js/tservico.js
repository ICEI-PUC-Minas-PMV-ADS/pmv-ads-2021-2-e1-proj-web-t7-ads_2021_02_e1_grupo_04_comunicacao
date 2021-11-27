const KEY_BD = '@tiposervicossestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    tipoServico:[]
}


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
        var data = listaRegistros.tipoServico;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( tpServico => {
                return expReg.test( tpServico.om ) || expReg.test( tpServico.descricao )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.om < b.om ? -1 : 1
            })
            .map( tpServico => {
                return `<tr>
                        <td>${tpServico.id}</td>
                        <td>${tpServico.om}</td>
                        <td>${tpServico.descricao}</td>
                        <td>
                            <button onclick='visualizar("cadastro",false,${tpServico.id})'>
                                <i class=" fa fa-edit"></i>
                            </button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${tpServico.id})'>
                                <i class=" fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertOm(om, descricao){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.tipoServico.push({
        id, om, descricao
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editOm(id, om, descricao){
    var tpServico = listaRegistros.tipoServico.find( tpServico => tpServico.id == id )
    tpServico.om = om;
    tpServico.descricao = descricao;
    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteOm(id){
    listaRegistros.tipoServico = listaRegistros.tipoServico.filter( tpServico => {
        return tpServico.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteOm(id)
    }
}


function limparEdicao(){
    document.getElementById('id').value = '';
    document.getElementById('om').value = '';
    document.getElementById('descricao').value = '';
}

function visualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const tpServico = listaRegistros.tipoServico.find( tpServico => tpServico.id == id )
            if(tpServico){
                document.getElementById('id').value = tpServico.id
                document.getElementById('om').value = tpServico.om
                document.getElementById('descricao').value = tpServico.descricao
            }
        }
        document.getElementById('om').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        om: document.getElementById('om').value,
        descricao: document.getElementById('descricao').value,
    }
    if(data.id){
        editOm(data.id, data.om, data.descricao)
    }else{
        insertOm( data.om, data.descricao )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})