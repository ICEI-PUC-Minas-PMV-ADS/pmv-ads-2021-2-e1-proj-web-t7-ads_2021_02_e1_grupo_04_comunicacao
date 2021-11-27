const KEY_BD = '@relatoriosestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    relatorios:[]
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
        var data = listaRegistros.relatorios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( os => {
                return expReg.test( os.os ) || expReg.test( os.equipamento ) || expReg.test( os.descricao )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.os < b.os  ? -1 : 1
            })
            .map( os => {
                return `<tr>
                        <td>${os.id}</td>
                        <td>${os.os}</td>
                        <td>${os.equipamento}</td>
                        <td>${os.descricao}</td>
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

function insertOs(os, equipamento, descricao){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.relatorios.push({
        id, os, equipamento, descricao
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editOs(id, os, equipamento, descricao){
    var os = listaRegistros.relatorios.find( os => os.id == id )
    os.os = os;
    os.equipamento = equipamento;
    os.descricao = descricao;
    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteOs(id){
    listaRegistros.relatorios = listaRegistros.relatorios.filter( os => {
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
    document.getElementById('os').value = ''
    document.getElementById('equipamento').value = ''
    document.getElementById('descricao').value = ''
}

function visualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const os = listaRegistros.relatorios.find( os => os.id == id )
            if(os){
                 document.getElementById('id').value = os.id
                document.getElementById('os').value = os.os
                document.getElementById('equipamento').value = os.equipamento
                document.getElementById('descricao').value = os.descricao
            }
        }
        document.getElementById('os').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        os: document.getElementById('os').value,
        equipamento: document.getElementById('equipamento').value,
        descricao: document.getElementById('descricao').value,
    }
    if(data.id){
        editOs(data.id, data.os, data.equipamento, data.descricao)
    }else{
        insertOs( data.os, data.equipamento, data.descricao)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })
})