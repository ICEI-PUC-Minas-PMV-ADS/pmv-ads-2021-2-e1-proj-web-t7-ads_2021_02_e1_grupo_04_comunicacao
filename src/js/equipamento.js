const KEY_BD = '@equipamentosestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    equipamentos:[]
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
        var data = listaRegistros.equipamentos;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( equipamento => {
                 expReg.test( equipamento.tag ) || expReg.test( equipamento.modelo )|| expReg.test( equipamento.marca )|| expReg.test( equipamento.descricao )|| expReg.test( equipamento.grupoequipamento )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( equipamento => {
                return `<tr>
                <td>${equipamento.id}</td>
                <td>${equipamento.tag}</td>
                <td>${equipamento.modelo}</td>
                <td>${equipamento.marca}</td>
                <td>${equipamento.descricao}</td>
                <td>${equipamento.grupoequipamento}</td>
                
                <td>
                            <button onclick='visualizar("cadastro",false,${equipamento.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${equipamento.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertEquipamento(tag, modelo, marca, descricao, grupoequipamento){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.equipamentos.push({
       id, tag, modelo, marca,descricao,grupoequipamento
    })
    gravarBD()
    desenhar()
   visualizar('lista')
}

function editEquipamento(id,tag, modelo, marca,descricao,grupoequipamento){
    var equipamento = listaRegistros.equipamentos.find( equipamento => equipamento.id == id )
    equipamento.tag = tag;
    equipamento.modelo = modelo;
    equipamento.marca = marca;
    equipamento.descricao = descricao
    equipamento.grupoequipamento = grupoequipamento
    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteEquipamento(id){
    listaRegistros.equipamentos = listaRegistros.equipamentos.filter( equipamento => {
        return equipamento.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteEquipamento(id)
    }
}


function limparEdicao(){
    document.getElementById('id').value = ''
    document.getElementById('tag').value = ''
    document.getElementById('modelo').value = ''
    document.getElementById('marca').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('grupoequipamento').value = ''
    
    
}

function visualizar (pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const equipamento = listaRegistros.equipamentos.find( equipamento => equipamento.id == id )
            if(equipamento){
                document.getElementById('id').value = equipamento.id
                document.getElementById('tag').value = equipamento.tag
                document.getElementById('modelo').value = equipamento.modelo
                document.getElementById('marca').value = equipamento.marca
                document.getElementById('descricao').value = equipamento.descricao
                document.getElementById('grupoequipamento').value = equipamento.grupoequipamento
            }
        }
        document.getElementById('tag').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
       id: document.getElementById('id').value,
        tag: document.getElementById('tag').value,
        modelo: document.getElementById('modelo').value,
       marca: document.getElementById('marca').value,
       descricao:document.getElementById("descricao").value,
       grupoequipamento:document.getElementById("grupoequipamento").value,
    }


    if(data.id){
        editEquipamento(data.id, data.tag, data.modelo, data.marca, data.descricao, data.grupoequipamento)
    }else{
        insertEquipamento(data.tag, data.modelo, data.marca, data.descricao, data.grupoequipamento )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})