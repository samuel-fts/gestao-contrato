const num_contrato = document.getElementById("num_contrato")
const ano_contrato = document.getElementById("ano_contrato")
const fornecedor = document.getElementById("fornecedor")
const cnpj = document.getElementById("cnpj")
const obj_contrato = document.getElementById("obj_contrato")
const data_inicial = document.getElementById("data_inicial")
const data_final = document.getElementById("data_final")
const btn_salvar = document.getElementById("btn_salvar")
const section_cont = document.getElementById("section_cont")
const pesqui = document.getElementById("pesqui")
const btn_fechar = document.getElementById("btn_fechar")
const btn_env = document.getElementById("btn_env")
const valor = document.getElementById("valor")
const exibir = document.querySelector(".float")
const btn_edit = document.getElementById("btn_edit")
const btn_trash = document.getElementById("btn_trash")
const info = document.querySelector(".info")
let contratoSelecionado = []
const PORTA = 'https://gestao-contrato.onrender.com/exportar'
const PORTA_bkp = 'https://gestao-contrato.onrender.com/bkp'
const min_data = document.getElementById('min_data')
const max_data = document.getElementById('max_data')
const grafico_pizza = document.getElementById("grafico_pizza")
const grafico_info = document.getElementById("grafico_info")
const ativo_ = document.getElementById("ativo_")
const encerrado_ = document.getElementById("encerrado_")
const master = document.getElementById("master")


let a_contratos = []
let a_contrator_bkp = []

btn_salvar.addEventListener("click",()=>{
    a_dados = [cnpj, num_contrato, ano_contrato, fornecedor, obj_contrato, data_inicial, data_final ,valor]
    const verifi = a_dados.some(n=>n.value == "")
    a_dados.map((el)=>{
            el.classList.remove("error")
        })
    
    if(verifi == true){
        a_dados.map((el)=>{
            if(el.value == ""){el.classList.add("error")}
        })
    }else{
        if(a_dados[0].value.length < 18){alert("CNPJ inválido")}else{if(a_dados[2].value.length < 4){alert("Ano inválido")}else{
            const data_final_new = formata_data(data_final.value)
            const data_inicial_new = formata_data(data_inicial.value)
            a_contratos.push(new Contratos(num_contrato.value,fornecedor.value,cnpj.value,valor.value,ano_contrato.value,data_inicial_new,data_final_new,obj_contrato.value))
            a_contrator_bkp.push(new Contratos(num_contrato.value,fornecedor.value,cnpj.value,valor.value,ano_contrato.value,data_inicial_new,data_final_new,obj_contrato.value))
            alert("Salvo!")
            a_dados.map((el)=>{
                el.value = ''
            })
            exportarBkp()
            exportarBD()
            recebeBD()

        }}
        
        

    }


    
})
const  criar = ()=>{
    section_cont.innerHTML = ''
        a_contratos.map((el)=>{
            
            el.screen()
            
        })
}

const pesquisar = (valor)=>{
    const pesq = valor
    const x = document.createElement("button")
    section_cont.innerHTML = ''
    
    a_contratos.map((el)=>{
        for(let i = 0; i < Object.keys(el).length -1;i++){
            if(Object.values(el)[i].match(pesq)){
                el.screen()
                break;
            }
        }
    })
    
}
class Criar_btn{
    constructor(classe,id,valor, app, acao){
        this.btn = document.createElement("button");
        this.btn.className = classe;
        this.btn.id = id;
        this.btn.innerHTML = valor;
        app.appendChild(this.btn);
        this.btn.addEventListener("click",(el)=>{ acao(el.target)});
        
    }

   
}

btn_fechar.addEventListener("click",()=>{
    exibir.style.top = "-99999px"
    recebeBD()
})

btn_edit.addEventListener("click",()=>{
    contratoSelecionado.editar();
    
})

const formata_data = (data_f)=>{
    const data = new Date().toLocaleDateString('pt-BR')
    const dataObj = new Date(data_f.replace(/-/g,'\/'));
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC'});
    return dataFormatada;
}

class Contratos{
    constructor(num,fornecedor,cnpj,valor,ano,inicio,fim,objeto){
        this.profile = ""
        this.alter = ""
        this.num = num;
        this.fornecedor = fornecedor;
        this.cnpj = cnpj;
        this.valor = valor;
        this.ano = ano;
        this.inicio = inicio;
        this.fim = fim;
        this.objeto = objeto;
        this.status = "";
        this.val = false;
        
       
       
    }
    editavel(el,btn_e){
        const pai= el.parentNode
        const text = pai.parentNode.children[1].innerHTML
        const num_g = pai.parentNode.parentNode.children[0].children[1].innerHTML
        const el_index = el.dataset.campo
        el.remove()
        pai.previousSibling.remove()
        const input = document.createElement("input")
        pai.parentNode.insertBefore(input,pai.parentNode.lastElementChild)
        input.setAttribute("type", "text")
        input.setAttribute("placeholder",text)
        input.setAttribute("maxlength", "18")
        if(el_index == "cnpj"){
            input.setAttribute("maxlength", "18")
            input.addEventListener("input",(e)=>{input.value = formatarCNPJ(e.target.value)})
        }else if(el_index == "ano"){
             input.setAttribute("maxlength", "4")
        }else if(el_index == "valor"){
            input.addEventListener("input",(e)=>{input.value = formatarValor(e.target.value)})
        }else if(el_index == "inicio" || el_index == "fim" ){input.setAttribute("type", "date")}
        const receber = pai.parentNode.lastElementChild
        const btn_ss = new Criar_btn("selecionado","btn_s","salvar",receber,(el)=>{
            if(input.value){
                if(confirm("Tem certeza que deseja alterar direto do banco de dados?")){
                    let valor_i = input.value
                    if(el_index == "inicio" || el_index == "fim"){
                       valor_i = formata_data(valor_i)   
                    }
                    a_contratos.forEach((ele)=>{if(ele.num == this.num){
                        ele[el_index] = valor_i
                        this.exibir()
                        exportarBD()
                        recebeBD()
                    }})
                }else{this.exibir()}
                
            }
            
        })
        const btn_x = new Criar_btn("selecionado","btn_x","x",receber,(el)=>{this.editar()})
        pai.classList.add("div_e")
        btn_e.forEach((btn)=>{
            if(!btn.classList.contains("selecionado")){
                try{btn.parentNode.remove()}catch{}
            }
        })
    }
    screen(){
        const tr = document.createElement("tr")
        section_cont.appendChild(tr)
        tr.innerHTML = `
        <td><input class="items_ch" type="checkbox"></input<</td>
        <td>${this.num}</td>
        <td>${this.fornecedor}</td>
        <td>${this.cnpj}</td>
        <td>${this.valor}</td>
        <td>${this.ano}</td>
        <td>${this.inicio}</td>
        <td>${this.fim}</td>
        <td>${this.objeto}</td>
        <td><span class="${this.compara_data()}">${this.compara_data()}</span></td>
        <td></td>
        `
        const items_ch = document.querySelectorAll(".items_ch")
        tr.addEventListener("click",(e)=>{

            if(e.target.classList.value == "items_ch" && e.target.checked){
                contratoSelecionado.push(this)
                return
            }else  if(e.target.classList.value == "items_ch"){ contratoSelecionado = contratoSelecionado.filter(el=> el!= this);console.log(contratoSelecionado); return}
            contratoSelecionado = this;
            this.exibir();
        })
        
        master.addEventListener("change",()=>{
            items_ch.forEach((el) => {el.checked = master.checked
                if(el.checked){contratoSelecionado = a_contratos}else{contratoSelecionado = []}
                
            })
            
            
            
        })
        btn_trash.addEventListener("click",()=>{
            const exb = document.getElementById("float_b")
            const tela = `
            <div class="float_b">
                <div class="card_float">
                    <h3 style="margin-bottom: 20px;">Tem certeza que deseja excluir esse contrato do banco de dados?<h3>
                    <div class="bar_float_2">
                        <button id="btn_sim" class="btn">Apagar</button>
                        <button id="btn_nao" class="btn">Cancelar</button>
                    </div>
                </div>
            </div>
            `
            
            exb.innerHTML = tela
            const btn_sim = document.getElementById("btn_sim")
            const btn_nao = document.getElementById("btn_nao")
            btn_sim.addEventListener("click",()=>{
                exb.innerHTML = ''
                a_contratos.map((el)=>{
                    contratoSelecionado.forEach((ele)=>{if(el.num == ele.num){
                        a_contratos = a_contratos.filter(e=>e!=ele)
                        
                    }})
                })
                exportarBD()
            })
            btn_nao.addEventListener("click",()=>{
                exb.innerHTML=''
            })
            
        })
    }
    remove(){
        let retorno = false
        a_contratos.forEach((el)=>{
            if(el.num == this.num){      
                for(let i = 0;i<Object.keys(el).length;i++){
                    if(Object.values(el)[i] == Object.values(this)[i]){
                        retorno = true
                    }else{
                        retorno = false
                        break;
                    }
                
                }
                if(retorno == true){ 
                    a_contratos = a_contratos.filter((ele)=>{return ele != el})
                    exibir.style.top = "-99999px"
                    criar()
                    
                }
                retorno = false
            }
        })
    }
    exibir(){

        
        exibir.style.top = "0px"
        
        info.innerHTML = ""
        info.innerHTML = `
                    <li class="items_text"><b>Número: </b>${this.num}</li>
                    <li class="items_text"><b>Fornecedor:  </b>${this.fornecedor}</li>
                    <li class="items_text"><b>CNPJ: </b> ${this.cnpj}</li>
                    <li class="items_text"><b>Valor: </b>${this.valor}</li>
                    <li class="items_text"><b>Ano: </b>${this.ano}</li>
                    <li class="items_text"><b>Início: </b>${this.inicio}</li>
                    <li class="items_text"><b>Fim: </b>${this.fim}</li>
                    <li class="items_text"><b>Objeto: </b><span>${this.objeto}</span></li>
                    <li class="items_text"><b >Status: </b>${this.status}</li>

        `
        
    }   
    editar(){
            this.val = !this.val
            if(this.val){
                info.innerHTML = ""
                info.innerHTML = `
                    <li class="items_text"><b>Número: </b><span>${this.num}</span><div><button class="btn_e" data-campo="num">editar</button></div></li>
                    <li class="items_text"><b>Fornecedor:  </b><span>${this.fornecedor}</span><div><button class="btn_e" data-campo="fornecedor">editar</button></div></li>
                    <li class="items_text"><b>CNPJ: </b> <span>${this.cnpj}</span><div><button class="btn_e" data-campo="cnpj">editar</button></div></li>
                    <li class="items_text"><b>Valor: </b><span>${this.valor}</span><div><button class="btn_e" data-campo="valor">editar</button></div></li>
                    <li class="items_text"><b>Ano: </b><span>${this.ano}</span><div><button class="btn_e" data-campo="ano">editar</button></div></li>
                    <li class="items_text"><b>Início: </b><span>${this.inicio}</span><div><button class="btn_e" data-campo="inicio">editar</button></div></li>
                    <li class="items_text"><b>Fim: </b><span>${this.fim}</span><div><button class="btn_e" data-campo="fim">editar</button></div></li>
                    <li class="items_text"><b>Objeto: </b><span>${this.objeto}</span><div><button class="btn_e" data-campo="objeto">editar</button></div></li>
                    <li class="items_text"><b >Status: </b><span>${this.status}</span></li>
        ` 
                const btn_e = [...document.querySelectorAll(".btn_e")]
                btn_e.forEach((btn)=>{
                    btn.addEventListener("click",(el)=>{
                       this.editavel(el.target,btn_e) 
                    })
                })
            }else{
                this.exibir()

            }

             
        
        
        
    }
    compara_data(){
        let new_date = this.fim.split("/")
        let data = new Date(new_date[2], new_date[1]-1, new_date[0])
        if(data > new Date()){
            this.status = "ativo"
            return "ativo"
        }else{this.status = "encerrado";return "encerrado"}
    }
}
let min = ""
let max = ""
min_data.addEventListener("input",(el)=>{
    min = el.target.value
    pesqui_data()
})
max_data.addEventListener("input",(el)=>{
    max = el.target.value
    pesqui_data()
})

const pesqui_data = ()=>{
    section_cont.innerHTML =""
    if((min.length == 4 && max.length == 4)||(min.length == 4 && max.length == 0)||(min.length == 0 && max.length == 4)){
         if(min != "" && max == "" ){
        a_contratos.map((el)=>{
            if(Number(el.ano) >= Number(min)){
               
                el.screen()
            }
        })
    }else if(min == "" && max != ""){
        a_contratos.map((el)=>{
            if(Number(el.ano) <= Number(max)){
                el.screen()
            }
        })
    }else if(min != "" && max !=""){
        a_contratos.map((el)=>{
            if(Number(el.ano) <= Number(max) && Number(el.ano) >= Number(min)){
                el.screen()
            }
        })
    }
    }else{criar()}
   
}

const graficos = ()=>{
    let anos = []
    let quant = []
    let j = 0
    let c_ano = ""
    //pegar o ano e descobrir quanto iguais 
    a_contratos.map((el)=>{
        if(!anos.includes(el.ano)){
            anos.push(el.ano)
        }
        
    })
    for(let i =0; i < anos.length; i++){
        j = 0
        a_contratos.map((el)=>{
            if(anos[i] == el.ano){
                c_ano = el.ano
                j++
            }
            
        })
        quant.push({ano: c_ano, vezes: j});;
        
    }
    calc_grafico(quant)
}

const calc_grafico=(quant)=>{
    let val = 0
    quant.map((el)=>{val = val + el.vezes})
    
    let percent = 360-quant.length*2
    percent = percent/val

    let a_grap = []
    quant.map((el)=>{a_grap.push({ano:el.ano, vezes: el.vezes, porcentagem: el.vezes*percent}) })

    canva_graph(a_grap)
}

const canva_graph = (a_grap)=>{
    let str = 0
    let value = ""
    let cor= 0
    grafico_info.innerHTML =""
    a_grap.forEach((el)=>{ 
       
        let val = str+el.porcentagem
        let gap = val+2
        let cor_1 = cor_al(1,cor)
        let cor_2 = cor_al(2,cor)
        value = value + `hsl(${cor},${cor_1}%,${cor_2}%)`+" "+ str +"deg"+ " " + val +"deg"+ "," + "white" + " "+ val +"deg"+" "+gap+"deg"+","
        val = gap
        str = val
         
        grafico_info.innerHTML += `<li><div style="background-color:hsl(${cor},${cor_1}%,${cor_2}%);" class="bloco"></div><span>${el.ano}--${el.vezes}</span></li>`
        cor = cor + 28
    })
  
    grafico_pizza.style.background = `radial-gradient(white 40%, transparent 40%), conic-gradient(${value.slice(0,-1)})` 
    grafico_reto()
}
const grafico_reto = ()=>{
    
    let at = 0
    let en = 0
    a_contratos.map((el)=>{
        if(el.status == "ativo"){
            at++
          
        }else if(el.status == "encerrado"){
            en++
           
        }
    })
    at = at*8
    en= en*8
    ativo_.style.height = at+"px"
    encerrado_.style.height = en+"px"
}

const cor_al=(val, cor)=>{
    if(val== 1){
        return 100;
    }
    if(val==2){ return  50+ Math.floor(Math.random()*30);}
}

const formatVal = (valores)=>{
    let val = formatarValor(valores)
    valor.value = val
}
const formatCNPJ = (cnpj_)=>{
    let cn = formatarCNPJ(cnpj_)
    cnpj.value = cn
}

const formatarValor = (valores)=>{
    valores = valores.replace(/\D/g, "")
     valores = (valores / 100).toFixed(2);
     if (isNaN(valores) || valores == 0) {
        
        return ""
    } else {
        
        return valor.value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valores);
    }
}
const formatarCNPJ = (cnpj_)=>{
    cnpj_ = cnpj_.replace(/\D/g, "");
    if(isNaN(cnpj_)){
       
        return ""
    }else{
        
        cnpj_ = cnpj_.replace(/^(\d{2})(\d)/, "$1.$2");
        cnpj_ = cnpj_.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        cnpj_ = cnpj_.replace(/\.(\d{3})(\d)/, ".$1/$2");
        cnpj_ = cnpj_.replace(/(\d{4})(\d)/, "$1-$2");
       
        return cnpj_
    }
   
}
const recebeBD = ()=>{
  
    fetch("https://gestao-contrato.onrender.com/")
    .then(res => res.json())
    .then((bd)=>{const dados = bd;
        a_contratos = dados.map(el=> new Contratos(el.num, el.fornecedor, el.cnpj, el.valor, el.ano, el.inicio, el.fim, el.objeto))
         criar()
         graficos()
    })

   
}
const exportarBkp = ()=>{
    fetch(PORTA_bkp,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(a_contrator_bkp)
    })
}


const exportarBD = ()=>{
    fetch(PORTA,{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(a_contratos)
    })
}




recebeBD()






















/*const criar_contrato = ()=>{
    section_cont.innerHTML = ''
    a_contratos.map((el)=>{
            const ul = el.criar_ul()
            el.criar_li(el,ul)
        })
}
/*btn_env.addEventListener("click",(e)=>{
    const limpar = document.createElement("button")
    limpar.setAttribute("class","btn_small")
    const pai = e.target.parentNode
    if(pesqui.value != ""){
        if(pai.children.length < 3){
            pai.style.display = "flex"
            pai.style.justifyContent = "center"
            pai.style.alignItems = "center"
            pai.appendChild(limpar)
            limpar.innerHTML = "X"
            limpar.style.borderRadius = "15px"
            limpar.addEventListener("click",()=>{criar_contrato();pai.removeChild(pai.lastElementChild)})
            
        }
        pesquisar() 
    }
    
})

const pesquisar = ()=>{
    const val = pesqui.value
    pesqui.value = ''
    section_cont.innerHTML = ''
    a_contratos.map((el)=>{
        console.log("no map")
        for(let i=0;i<Object.keys(el).length;i++){
            if(Object.values(el)[i].match(val)){
                console.log("no for")
                const ul = el.criar_ul();
                el.criar_li(el,ul)
                break;
            }
        }
    })
}

btn_salvar.addEventListener("click",()=>{
    if(cnpj.value.length < 14||num_contrato.value=="" || data_inicial.value == "" || data_final.value == "" || ano_contrato.value == "" || fornecedor.value == "" || cnpj.value == "" || obj_contrato.value == "" ){
        if(cnpj.value.length < 14){
            alert("numero de cnpj incompleto")
        }else{alert("preencha todos os campos corretamente")}
        
        
    }else{
        a_contratos.push(new Contratos(num_contrato.value, data_inicial.value, data_final.value,ano_contrato.value,fornecedor.value,cnpj.value,obj_contrato.value))
        num_contrato.value = ''
        data_inicial.value = ''
        data_final.value = ''
        ano_contrato.value = ''
        fornecedor.value = ''
        cnpj.value = ''
        obj_contrato.value = ''
        criar_contrato()
        alert("salvo!")
    }
    
})
/*const grid = document.getElementById("grid_view")
const btn_ex = document.getElementById("btn_ex")
btn_ex.addEventListener("click",()=>{grid.style.left = "-9999px"})
const ul_grid = document.getElementById("ul_grid")
const viwer = (num)=>{
    grid.style.left = "0" 
    a_contratos.map((el)=>{
        if(el.num == num){
            for(let i = 0; i< ul_grid.children.length; i++){
                ul_grid.children[i].children[1].innerHTML = Object.values(el)[i]
            }
        }
    }) 
    


}

class Contratos{
    constructor(num, d_initial, d_final,ano_contrato,fornecedor,cnpj,obj_contrato){
        this.num = num;
        this.cnpj_fornecedor = cnpj+"/"+fornecedor;
        this.obj_contrato = obj_contrato;
        this.d_initial = d_initial;
        this.d_final = d_final;
        this.ano_contrato = ano_contrato;
        
        
    }
    remove(){
        a_contratos = a_contratos.filter((el)=>{
            return el.num != this.num;
        })
    }
    alter(alt,altNew){
        if(alt == this.num){
            this.num = altNew;
        }else{if(alt == this.d_initial){
                this.d_initial = altNew;
            }else{
                this.d_final = altNew;
            }
    }}
    criar_ul(){
        const ul = document.createElement("ul")
        ul.setAttribute("class","items")
        section_cont.appendChild(ul)
        return ul;
    }
    alt_dados(el){
        let p_key = el.childNodes[0].textContent
        /*try{el.parentNode.childNodes[0].children[0].innerHTML = ''}
        catch{}
        const regex_b = /\d{14}\//;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        let num_key = el.parentNode.childNodes[0].textContent
        el.innerHTML = ""
        if(!el.children.length<3){
            const input = document.createElement("input")
            const input_2 = document.createElement("input")
            console.log(p_key)
            
            if(p_key.match(regex) ){
            input.setAttribute("type","date")
            }else{input.setAttribute("type","text")}
            if(p_key.match(regex_b)){
                el.appendChild(input_2)
                input_2.setAttribute("style","width:80px;")
                input_2.setAttribute("type","text")
                input_2.setAttribute("maxlength","14")
                const span = document.createElement("span")
                el.appendChild(span)
                span.innerHTML = "/"
            } 
            if(p_key.match(/^\d{4}$/) && p_key != num_key){
                input.setAttribute("maxlength","4")
            }    
            input.setAttribute("style","width:80px;")
            el.appendChild(input)
            const btn_s = document.createElement("button")
            el.appendChild(btn_s)
            btn_s.setAttribute("class","btn_small")
            btn_s.innerHTML = "s"
            btn_s.addEventListener("click",()=>{
                if(input.value != ''){
                    for(let i=0; i<Object.keys(this).length;i++){
                        if(p_key == Object.values(this)[i]){
                            if(p_key.match(regex_b)&& input_2.value.length < 14){
                                alert("numero de cnpj incompleto")
                            }
                            else{
                                if(num_key == this.num){
                                    const c_key = Object.keys(this)[i]
                                    a_contratos.forEach((el)=>{
                                        if(num_key == el.num){
                                            if(p_key == el[c_key]){
                                                console.log( el[c_key])
                                                el[c_key] = input_2.value+"/"+input.value;
                                                console.log(a_contratos)
                                            }
                                        }
                                        
                                    
                                        
                                    })
                                }
                                criar_contrato()
                            }
                            
                            
                        }
                    }
                    
                }else{
                    alert("campo vazio")
                }
                
            })
            const btn_n = document.createElement("button")
            el.appendChild(btn_n)
            btn_n.setAttribute("class","btn_small")
            btn_n.innerHTML = "x"
            btn_n.addEventListener("click",()=>{criar_contrato()})
        }
       
    }
    criar_li(el,ul){
        for(let i=0; i<Object.keys(el).length; i++){
            const li = document.createElement("li")
            const span = document.createElement("span")
            li.setAttribute("class", "items_cont")
            span.setAttribute("class","text")
            li.appendChild(span)
            ul.appendChild(li)
            span.innerHTML = Object.values(el)[i]
        }
        const li_a = document.createElement("li")
        li_a.setAttribute("class","items_cont")
        ul.appendChild(li_a)
        const btn_remove = document.createElement("button")
        li_a.appendChild(btn_remove)
        btn_remove.setAttribute("class","btn_small")
        const trash = document.createElement("img")
        btn_remove.appendChild(trash)
        trash.setAttribute("src", "imgs/lixeira-xmark.png")
        trash.setAttribute("class","img_btn")
        btn_remove.addEventListener("click",()=>{this.remove();criar_contrato()})
        const btn_view = document.createElement("button")
        li_a.appendChild(btn_view)
        btn_view.setAttribute("class","btn_small")
        const img_view = document.createElement("img")
        btn_view.appendChild(img_view)
        img_view.setAttribute("src","imgs/olho.png")
        btn_view.addEventListener("click",()=>{viwer(this.num)})
        img_view.setAttribute("class","img_btn")
        const btn_alt = document.createElement("button")
        li_a.appendChild(btn_alt)
        btn_alt.setAttribute("class","btn_small")
        const img = document.createElement("img")
        btn_alt.appendChild(img)
        img.setAttribute("src", "imgs/editar.png")
        img.setAttribute("class","img_btn")
        btn_alt.addEventListener("click",()=>{
            for(let i=0;i<ul.children.length-1;i++){

                if(ul.children[i].children.length<=1){
                    const btn = document.createElement("button")
                    ul.children[i].appendChild(btn)
                    btn.setAttribute("class","btn_small")
                    const img = document.createElement("img")
                    btn.appendChild(img)
                    img.setAttribute("src","imgs/lapis.png")
                    img.setAttribute("class","img_btn")
                    btn.addEventListener("click",(el)=>{
                        const a_li = [...el.currentTarget.parentNode.parentNode.children]
                        a_li.map((ele)=>{
                            if(el.currentTarget == ele.lastElementChild){
                                this.alt_dados(el.currentTarget.parentNode)
                            }else{
                                ele.lastElementChild.remove()
                            }
                        })
                        
                    }) 
                }
                
            }
        })
    }
    

}
*/
