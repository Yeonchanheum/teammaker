let users = []
let save = localStorage.getItem('saveValue')

class Guest{
    static #counter = 0
    constructor(이름, 티어1, 티어2){
        this.이름 = 이름
        this.티어1 = 티어1
        this.티어2 = 티어2
        this.참가 = 1
        this.ID = Guest.#counter
        this.상태 = 1
        Guest.#counter += 1
        let sum = 0
        let bonus = 0
        switch(this.티어1){
            case '언랭':
                sum += 0
                break;
            case '아이언':
                sum += 400
                break;
            case '브론즈':
                sum += 800
                bonus += 10
                break;
            case '실버':
                sum += 1200
                bonus += 15
                break;
            case '골드':
                sum += 1600
                bonus += 20
                break;
            case '플레티넘':
                sum += 2000
                bonus += 25
                break;
            case '에메랄드':
                bonus += 30 
                sum += 2400
                break;
            case '다이아몬드':
                bonus += 35
                sum += 2800
                break;
            case '마스터':
                bonus += 38
                sum += 3200         
                break;
            case '그랜드마스터':
                bonus += 41
                sum += 3400
                break;
            case '챌린저':
                bonus += 45
                sum += 3600
                break
            default: console.log('오류발생')
        }
        switch(티어2){
            case '4':
                break;
            case '3':
                sum +=100
                break;
            case '2':
                sum +=200
                break;
            case '1':
                sum += 300
                break;
            case '기타':
                let howmuch = prompt('점수를 입력하세요', '숫자를 입력하세요')
                sum += Number(howmuch)
                this.티어2 = howmuch + '점'
                break;
            default: console.log('오류발생')
        }
        this.MMR = ((bonus + 100)*0.01 * sum).toFixed()
        users.push({
            '이름': this.이름,
            '티어1': this.티어1,
            '티어2': this.티어2,
            '참가' : this.참가,
            'ID': this.ID,
            'MMR': this.MMR,
            '상태': this.상태
        })
    }  
    printGuest(){
    return `이름: ${this.이름}\n티어: ${this.티어1}${this.티어2}\nMMR: ${this.MMR}\n참가: ${this.참가}\nID: ${this.ID}`
    }
    static setCounter(value) {
        Guest.#counter = value + 1;
    }
}


function save_Value(){
    let save_str = '['
    let counter = 0;
    for(let n of users){
        if(n.상태 == 1){
            save_str += JSON.stringify(n);
            save_str += ','
            counter = 1;
        }
    }
    save_str = save_str.slice(0, -1);
    save_str += ']'
    if(counter == 1){
        localStorage.setItem('saveValue', save_str);
    } else{
        localStorage.setItem('saveValue', '[]');
    }
    
}


function transe(user){
    for(let n of users){
        if(user.ID == n.ID){
            if(n.참가 == 0){
                user.참가 = 1
                n.참가 = 1
            }else{
                user.참가 = 0
                n.참가 = 0
            }
        }
    }
}



function remove(user, guest_list, item){
    for(let n of users){
        if(user.ID == n.ID && user.참가 == 0){
            n.상태 = 0
            guest_list.removeChild(item)
            save_Value();
        }
    }
}



function createAccount(user){
    const item = document.createElement('div')
    const p = document.createElement('span')
    const removeButton = document.createElement('button')
    const checkbox = document.createElement('input')
    const guest_list = document.querySelector('#guest-list');
    item.setAttribute('data-key', user.ID)
    guest_list.appendChild(item)
    item.appendChild(checkbox)
    item.appendChild(p)
    item.appendChild(removeButton)
    checkbox.type='checkbox'
    if(user.참가 == 1){
        checkbox.checked = true;
    }
    checkbox.addEventListener('change', (event)=>{
        transe(user);
        update();

        console.log(users)
    })
    removeButton.addEventListener('click', (event)=>{
        remove(user, guest_list, item)
    })
    p.textContent = `${user.이름}(${user.티어1}${user.티어2}, ${user.MMR})`
    removeButton.textContent = '제거하기'
    save_Value();
}



function update(){
    const menu = document.querySelector('#menu')
    let num = 0
    let str = ''
    for(let n of users){
        if(n.상태 == 1 && n.참가 == 1){
            str += `${n.이름}\t`;
            num++
        }
    }
    str += `(${num}/10)`;
    menu.textContent = `${str}`
    save_Value();
}

function isTen(){
    let num = 0;
    for(let n of users){
        if(n.참가 == 1 && n.상태 == 1){
            num += 1;
        }
    }
    if(num == 10){
        return 1
    }else{
        return 0  
    }
}

//if getcombinations([1, 2, 3], 2) -> [1, 2] , [2, 3] , [1, 3] 
function getCombinations(arr, k) {
    const result = [];
    const f = (prefix, arr) => {
        for (let i = 0; i < arr.length; i++) {
            const newPrefix = prefix.concat(arr[i]);
            if (newPrefix.length === k) {
                result.push(newPrefix);
            } else {
                f(newPrefix, arr.slice(i + 1));
            }
        }
    }
    f([], arr);
    return result;
}

//MMR을 조합하여 합리적인 팀 생성
function teamSet(min = -1){
    let users_MMR = [];
    let team = [];
    let sumMMR = 0;
    let teamMMR = 0;
    let final = 100000;
    for(let n of users){
        if(n.상태 == 1 && n.참가 == 1){
            users_MMR.push(n.MMR);
            sumMMR += Number(n.MMR)
        }
    }
    for(const k of getCombinations(users_MMR, 5)){
        if(teamMMR != 0){
            teamMMR = 0;
        }
        for(let i = 0; i < 5 ; i++){
            teamMMR += Number(k[i])
        }
        if(Math.abs(sumMMR/2 - teamMMR) < final && min < Math.abs(sumMMR/2 - teamMMR)){
            console.log(min, final)
            team = [...k]
            final = Math.abs(sumMMR/2 - teamMMR)
            
        }
    }
    return [team, otherTeam(team, users_MMR), final]
    
}




function otherTeam(team, users_MMR){
    const arr = [...team]
    for(let k = 0; k<10; k++){
        for(let i = 0; i<5; i++){
            if(users_MMR[k] == arr[i]){
                users_MMR.splice(k, 1, -1)
                arr.splice(i, 1, -2)
            }
        }
    }
    const bteam = [];
    for(let k of users_MMR){
        if(k != -1){
            bteam.push(k)
        }
    }
    return bteam
}

//팀 생성할 때 10명이 맞는지 확인 후 teamSet()으로
function playGame(count){
    if (isTen()) {
        if(count === 0){
            let [a, b, newCount] = teamSet();
            return [a, b, newCount]
        }else{
            let [a, b, c] = teamSet(count);
            return [a, b, c]
        }

    }else {
        alert('10명을 선택해주세요.');
    }
}

//a팀, b팀 MMR을 이름으로 
function printTeam(a, b){
    let a_MMR = [...a];
    let b_MMR = [...b];
    let a_name = [];
    let b_name = [];

    for(let k of users){
        let n = 0;
        if(a_MMR.includes(k.MMR) && k.참가 == 1 && k.상태 == 1){
            a_name.push(k.이름)
            let num = a_MMR.indexOf(k.MMR)
            a_MMR.splice(num, 1, -1)
            n++;
        }
        if(b_MMR.includes(k.MMR) && k.참가 == 1 && k.상태 == 1 && n == 0){
            b_name.push(k.이름)
            let num = b_MMR.indexOf(k.MMR)
            b_MMR.splice(num, 1, -1)
        }
    }
    
    return `a팀: ${a_name}\nb팀: ${b_name}`
    

}
function makeBanner(banner, teamstr){
    const ateam_banner = document.createElement('p')
    const bteam_banner = document.createElement('p')
    const n_position = teamstr.indexOf('\n')
    let ateam_str = teamstr.slice(0, n_position);
    let bteam_str = teamstr.slice(n_position, teamstr.length)
    ateam_banner.textContent = `${ateam_str}`
    bteam_banner.textContent = `${bteam_str}`
    banner.appendChild(ateam_banner)
    banner.appendChild(bteam_banner)
}


function users_in_save(){
    users = [...JSON.parse(save)]
}


function reset_all() {
    localStorage.clear();
}


function getMaxID(){
    let i = 0;
    for(let n of users){
        if(n.ID > i){
            i = n.ID
        }
    }
    return Number(i)
}