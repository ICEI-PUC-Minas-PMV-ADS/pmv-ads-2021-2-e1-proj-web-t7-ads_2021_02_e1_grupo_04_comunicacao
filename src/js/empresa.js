const KEY_BD = '@empresasestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    empresas:[]
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
        var data = listaRegistros.empresas;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( empresa => {
                return expReg.test( empresa.nome ) || expReg.test( empresa.fone )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( empresa => {
                return `<tr>
                        <td>${empresa.id}</td>
                        <td>${empresa.nome}</td>
                        <td>${empresa.logo}</td>
                        <td>${empresa.logradouro}</td>
                        <td>${empresa.numero}</td>
                        <td>${empresa.complemento}</td>
                        <td>${empresa.cidade}</td>
                        <td>${empresa.uf}</td>
                        <td>
                            <button onclick='visualizar("cadastro",false,${empresa.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${empresa.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertempresa(nome, logo, logradouro, numero, complemento, cidade, uf){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.empresas.push({
        id, nome, logo, logradouro, numero, complemento, cidade, uf
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editempresa(id, nome, logo, logradouro, numero, complemento, cidade, uf){
    var empresa = listaRegistros.empresas.find( empresa => empresa.id == id )
    empresa.nome = nome;
    empresa.logo = logo;
    empresa.logradouro = logradouro;
    empresa.numero = numero;
    empresa.complemento = complemento;
    empresa.cidade = cidade;
    empresa.uf = uf;

    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteempresa(id){
    listaRegistros.empresas = listaRegistros.empresas.filter( empresa => {
        return empresa.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteempresa(id)
    }
}


function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('logo').value = ''
    document.getElementById('logradouro').value = ''
    document.getElementById('numero').value = ''
    document.getElementById('complemento').value = ''
    document.getElementById('cidade').value = ''
    document.getElementById('uf').value = ''
}

function visualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const empresa = listaRegistros.empresas.find( empresa => empresa.id == id )
            if(empresa){
                document.getElementById('id').value = empresa.id
                document.getElementById('nome').value = empresa.nome
                document.getElementById('logo').value = empresa.logo
                document.getElementById('logradouro').value = empresa.logradouro
                document.getElementById('numero').value = empresa.numero
                document.getElementById('complemento').value = empresa.complemento
                document.getElementById('cidade').value = empresa.cidade
                document.getElementById('uf').value = empresa.uf
            }
        }
        document.getElementById('nome').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        logo: document.getElementById('logo').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        cidade: document.getElementById('cidade').value,
        uf: document.getElementById('uf').value,
    }
    if(data.id){
        editempresa(data.id, data.nome, data.logo, data.logradouro, data.numero, data.complemento, data.cidade, data.uf)
    }else{
        insertempresa( data.nome, data.logo, data.logradouro, data.numero, data.complemento, data.cidade, data.uf)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})