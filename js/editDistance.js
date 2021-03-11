function colorCell(row, col, color) {
    // pick ri-cj element from the table and change its value acording to the matrix
    let cell = document.getElementById(`r${row}-c${col}`);
    if (cell != null){
        cssString = `background-color: ${color}; border-radius: 100%; font-weight: 600; color: white;`
        cell.style.cssText += ';'+ cssString;
    } else
        console.log(`cell[${i}][${j}] is equal to `, cell);
}

function drawMatrix(matrix, v_string, h_string) {

    let tbody = document.createElement('tbody');

    let horizontalLettersRow = document.createElement('tr');     
    
    let empty_th = document.createElement('th');
    empty_th.innerHTML = ' ';
    horizontalLettersRow.appendChild(empty_th);

    empty_th = document.createElement('th');
    empty_th.innerHTML = ' ';
    horizontalLettersRow.appendChild(empty_th);

    empty_th = document.createElement('th');
    empty_th.innerHTML = ' ';
    horizontalLettersRow.appendChild(empty_th);
    

    for (let c of h_string) {
        let th = document.createElement('th');
        th.innerHTML = c;
        th.classList.add('horizontal-letter');
        horizontalLettersRow.appendChild(th);
    }
    tbody.appendChild(horizontalLettersRow);

    let horizontalIndexRow = document.createElement('tr'); 

    empty_th = document.createElement('th');
    empty_th.innerHTML = ' ';
    horizontalIndexRow.appendChild(empty_th);

    empty_th = document.createElement('th');
    empty_th.innerHTML = ' ';
    horizontalIndexRow.appendChild(empty_th);

    for(let i=0; i< h_string.length+1; i++){
        let th = document.createElement('th');
        th.innerHTML = i;
        th.classList.add('horizontal-index');
        horizontalIndexRow.appendChild(th);
    }

    tbody.appendChild(horizontalIndexRow);

    
    for (let i=0; i< matrix.length; i++){
        let tr = document.createElement('tr');

        let verticalLetter_th = document.createElement('th');        
        if (i>0) {
            verticalLetter_th.innerHTML = v_string[i-1];
            verticalLetter_th.classList.add('vertical-letter');
        }
        else  
            verticalLetter_th.innerHTML = ' ';

        tr.appendChild(verticalLetter_th);

        verticalIndex_th = document.createElement('th');
        verticalIndex_th.innerHTML = i;
        verticalIndex_th.classList.add('vertical-index');
        tr.appendChild(verticalIndex_th);

        for (let j=0; j<matrix[i].length; j++) {
            let td = document.createElement('td');
            td.id = `r${i}-c${j}`;
            td.innerHTML = matrix[i][j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    let table = document.createElement('table');
    table.appendChild(tbody);

    document.getElementById('table-container').appendChild(table);
}

function handleComputing() {
    document.getElementById('compute-button').disabled = true;
    let s1 = document.getElementById('first_string').value;
    let s2 = document.getElementById('second_string').value;
    
    let distanceMatrix = getEditDistanceMatrix(s1,s2);

    drawMatrix(distanceMatrix,s1,s2);  // creates and displays a table on the web page

    lastRow = distanceMatrix.length - 1;
    lastCol = distanceMatrix[0].length -1;
    editDistance = distanceMatrix[lastRow][lastCol];

    showResult(editDistance);
    
    colorBackTrack(D, lastRow, lastCol);
}

function colorBackTrack(D, r, c) {
    color = ( r === D.length-1 && c === D[0].length - 1) ? '#cc2900' : '#002233'; 
    
    colorCell(r, c, color); // #80ffbf

    topForbidden = false;
    leftForbidden = false;

    if ( r === 0 ) 
        topForbidden = true;
    if ( c === 0 )
        leftForbidden = true;

    if (topForbidden && leftForbidden)
        return ;

    if (topForbidden)
        colorBackTrack(D, r, c-1);

    else if (leftForbidden)
        colorBackTrack(D, r-1, c);

    else {
        let top = D[r-1][c];    // Watch out for 'top' reserved word!
        let left = D[r][c-1];
        let diagonal = D[r-1][c-1];
        let min = getMin(top, left, diagonal);

        if (diagonal === min) 
            colorBackTrack(D, r-1, c-1);
        else if (left === min)
            colorBackTrack(D, r, c-1);
        else 
            colorBackTrack(D, r-1, c);
    }       
}

document.getElementById("reset-button").addEventListener("click", function(event){
    node_s1 = document.getElementById('first_string');
    node_s2 = document.getElementById('second_string');
    node_s1.removeAttribute('readonly');
    node_s2.removeAttribute('readonly');
    node_s1.value = '';
    node_s2.value = '';
    document.getElementById('reset-button').style.display = 'none';
    document.getElementById('table-container').innerHTML = '';
    document.getElementById('compute-button').disabled = false;
    result = document.getElementById('result')
    result.parentNode.removeChild(result);

});

document.getElementById("compute-button").addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById('first_string').setAttribute('readonly','true');
    document.getElementById('second_string').setAttribute('readonly','true');
    handleComputing();
    document.getElementById('reset-button').style.display = 'block';

});


/* 
    We place:
    # s1 as the vertical string
    # s2 as the horizontal string
*/
function getInitialMatrix(s1,s2) {
    let D = []; // matrix
    let numberOfRows = s1.length + 1;
    let numberOfCols = s2.length + 1;

    let firstRow = [];
    for (let j=0; j < numberOfCols; j++) {
        firstRow.push(j);
    }
    D.push(firstRow)

    // Initialize empty matrix
    for (let i=1; i < numberOfRows; i++) { 
        row = [i];
        for(let k=1; k < numberOfCols; k++)
            row.push('');
        D.push(row);
    }
    
    return D;
}

// returns the minimum value between args
function getMin(...args){
    min = args[0];
    for (let value of args)
        if (value < min) 
            min = value;
    return min;
}

function getEditDistanceMatrix(s1,s2) {
    // s1 vertical string, s2 horizontal string
    D = getInitialMatrix(s1,s2);
    
    numberOfRows = s1.length + 1;
    numberOfCols = s2.length + 1;

    for (j=1; j < numberOfCols; j++)
        for (i=1; i < numberOfRows; i++){
            insertion = D[i][j-1] + 1;
            deletion  = D[i-1][j] + 1;
            match     = D[i-1][j-1];
            mismatch  = D[i-1][j-1] + 1;
            if (s1[i-1] === s2[j-1]) 
                D[i][j] = getMin(insertion,deletion,match);
            else
                D[i][j] = getMin(insertion,deletion,mismatch);
        }
    return D;
}

function showResult(result) {
    h4 = document.createElement('h4');
    h4.innerHTML = `The edit distance is ${result}`;
    h4.id = 'result';

    col = document.createElement('div');
    col.classList.add('col-12');
    col.appendChild(h4)
    
    row = document.createElement('div');
    row.classList.add('row');
    row.appendChild(col);

    mainContainer = document.getElementById('main-container');
    mainContainer.appendChild(row);
}