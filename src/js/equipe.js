const KEY_BD = '@equipeestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    equipes:[]
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
        var data = listaRegistros.equipes;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( equipe => {
                return expReg.test( equipe.nomes ) || expReg.test( equipe.os )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nomes < b.nomes ? -1 : 1
            })
            .map( equipe => {
                return `<tr>
                        <td>${equipe.id}</td>
                        <td>${equipe.nomes}</td>
                        <td>${equipe.os}</td>
                        <td>
                            <button onclick='visualizar("cadastro",false,${equipe.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${equipe.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertequipe(nomes, os){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.equipes.push({
        id, nomes, os
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editequipe(id, nomes, os){
    var equipe = listaRegistros.equipes.find( equipe => equipe.id == id )
    equipe.nomes = nomes;
    equipe.os = os;
    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteequipe(id){
    listaRegistros.equipes = listaRegistros.equipes.filter( equipe => {
        return equipe.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteequipe(id)
    }
}


function limparEdicao(){
    document.getElementById('nomes').value = ''
    document.getElementById('os').value = ''
}

function visualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const equipe = listaRegistros.equipes.find( equipe => equipe.id == id )
            if(equipe){
                document.getElementById('id').value = equipe.id
                document.getElementById('nomes').value = equipe.nomes
                document.getElementById('os').value = equipe.os
            }
        }
        document.getElementById('nomes').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nomes: document.getElementById('nomes').value,
        os: document.getElementById('os').value,
    }
    if(data.id){
        editequipe(data.id, data.nomes, data.os)
    }else{
        insertequipe( data.nomes, data.os )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})