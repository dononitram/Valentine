class Crossword {
    
    constructor(board) {
        this.nrows = 11;
        this.ncols = 9;
        this.board = board.split(","); 
        this.boardArray = this.initBoard(); 
        this.t0 = null; 
        this.t1 = null;  
    }

    begin() {
        this.start();
        this.paintCrucigrama();
        this.addListeners();
    }

    initBoard() {      
        let boardArray = new Array(this.nrows);
        for (let i = 0; i < this.nrows; i++)
            boardArray[i] = new Array(this.ncols);
        return boardArray;
    }

    start() {
        let k = 0;
        for (let i = 0; i < this.nrows; i++) {
            for (let j = 0; j < this.ncols; j++) {
                
                if (this.board[k] == '.')
                    this.boardArray[i][j] = "0";
                
                else if (this.board[k] == '#')
                    this.boardArray[i][j] = "-1";
                
                else
                    this.boardArray[i][j] = this.board[k];

                k++;
            }
        }
    }

    paintCrucigrama() {
        let mainElement = $("main");

        for (let i = 0; i < this.nrows; i++) {
            for (let j = 0; j < this.ncols; j++) {
                
                let p = $("<p></p>");

                if (this.boardArray[i][j] == "0") {
                    p.click(function() {
                        $("main p[data-state='clicked']").attr("data-state", "");
                        $(this).attr("data-state", "clicked");
                    });
                }
                
                else if (this.boardArray[i][j] == "-1") {
                    p.text("");
                    p.attr("data-state", "wall");
                }
                
                else if (!isNaN(this.boardArray[i][j]) && parseInt(this.boardArray[i][j]) > 0) {
                    p.text(this.boardArray[i][j]);
                    p.attr("data-state", "blocked");
                }
                
                else {
                    p.text(this.boardArray[i][j]);
                    p.attr("data-state", "other")
                }

                p.attr("data-row", i);
                p.attr("data-column", j);

                mainElement.append(p);
            }
        }

        this.t0 = new Date();
    }

    check_win_condition() {
        for (let i = 0; i < this.nrows; i++) {
            for (let j = 0; j < this.ncols; j++) {
                if (this.boardArray[i][j] == "0") {
                    return false;
                }
            }
        }
        return true;
    }

    // calculate_date_difference() {
    //     const tiempoMilisegundos = this.t1 - this.t0;
    //
    //     const segundos = Math.floor(tiempoMilisegundos / 1000);
    //     const minutos = Math.floor(segundos / 60);
    //     const horas = Math.floor(minutos / 60);
    //
    //     return horas + ":" + (minutos % 60) + ":" + (segundos % 60);
    // }
    
    addListeners() {
        $(document).keydown(function(event) {
            let tecla = event.key;
            if (tecla == "Delete")
                tecla = "d";
            if (/^[0-9+\-*d/]$/.test(tecla)) {
                crossword.handleKeyDown(tecla);
            }
        });
    }

    checkHorizontalExpression(row, col) {
        for (let i = col; i < this.ncols; i++) {
            if(this.boardArray[row][i] == "=") {

                const first_number = this.boardArray[row][i - 3];
                const expression = this.boardArray[row][i - 2];
                const second_number = this.boardArray[row][i - 1];
                const result = this.boardArray[row][i + 1];

                if(first_number != "0" && result != "0" && second_number != "0" && expression != "0") {
                    const expressionArray = [first_number, expression, second_number];
                    const expressionString = expressionArray.join('');

                    return parseInt(result) == parseInt(eval(expressionString));
                }
            }
        }
        return true;
    }
    
    checkVerticalExpression(row, col) {
        for (let i = row; i < this.nrows; i++) {
            if(this.boardArray[i][col] == "=") {

                const first_number = this.boardArray[i - 3][col];
                const expression = this.boardArray[i - 2][col];
                const second_number = this.boardArray[i - 1][col];
                const result = this.boardArray[i + 1][col];

                let expressionArray = [first_number, expression, second_number];
                let expressionString = expressionArray.join('');

                if(first_number != "0" && result != "0" && parseInt(second_number) != 0 && expression != "0") {
                    expressionArray = [first_number, expression, second_number];
                    expressionString = expressionArray.join('');

                    return parseInt(result) == parseInt(eval(expressionString));
                }
            }
        }
        return true;
    }

    handleKeyDown(tecla) {

        let expression;
        if (tecla == "0") {
            alert("La entrada no puede ser 0");
            return;
        }

        if (tecla == "d")
            tecla = 0;

        const celdaSeleccionada = $("main p[data-state='clicked']");

        if (celdaSeleccionada.length > 0) {

            const valorAnterior = this.boardArray[celdaSeleccionada.data('row')][celdaSeleccionada.data('column')];
            this.boardArray[celdaSeleccionada.data('row')][celdaSeleccionada.data('column')] = tecla;

            let expression_row = true;
            let expression_col = true;

            if (celdaSeleccionada.data('column')+1 != this.ncols && this.boardArray[celdaSeleccionada.data('row')][celdaSeleccionada.data('column')+1] != -1) {
                expression = this.checkHorizontalExpression(celdaSeleccionada.data('row'), celdaSeleccionada.data('column'));
                if (!expression) {
                    expression_row = false;
                }
            }
    
            if (celdaSeleccionada.data('row')+1 != this.nrows && this.boardArray[celdaSeleccionada.data('row')+1][celdaSeleccionada.data('column')] != -1) {
                expression = this.checkVerticalExpression(celdaSeleccionada.data('row'), celdaSeleccionada.data('column'));
                if (!expression) {
                    expression_col = false;
                }
            }
    
            if (expression_row && expression_col) {
                if (tecla != "0")
                    celdaSeleccionada.text(tecla);
                else
                    celdaSeleccionada.text("");
            }
            
            else {
                this.boardArray[celdaSeleccionada.data('row')][celdaSeleccionada.data('column')] = valorAnterior;
                alert('Elemento introducido no es correcto para la casilla seleccionada.');
            }
    
            if (this.check_win_condition()) {
                this.createRecordForm();
            }

        }
    }

    introduceElement(tecla) {
        this.handleKeyDown(tecla);
    }

    createRecordForm() {

        this.t1 = new Date();

        let paragraphSuccess = $("<p>Nice! This is your time in seconds:</p>");

        let form = $("<form action='/home/games/crossword' method='post' name='resultado'></form>");

        let inputTime = $("<p><input type='text' name='tiempo' value='" + Math.floor((this.t1 - this.t0) / 1000) + "' readonly/></p>")

        let labelColor = $('<p><label for="color">Favourite Color</label></p>')
        let inputColor = $('<p><input type="text" name="color" id="color" required="required"/></p>')

        let labelFood = $('<p><label for="food">Favourite Food</label></p>')
        let inputFood = $('<p><input type="text" name="food" id="food" required="required"/></p>')

        let labelAnimal = $('<p><label for="animal">Favourite Animal</label></p>')
        let inputAnimal = $('<p><input type="text" name="animal" id="animal" required="required"/></p>')

        let labelRating = $('<p><label for="rating">Rate Carmen 1-8</label></p>')
        let inputRating = $('<p><input type="number" name="rating" id="rating" required="required"/></p>')

        let labelNextYear = $('<p><label for="nextYear">What would you like to see in 2025 edition?</label></p>')
        let inputNextYear = $('<p><input type="text" name="nextYear" id="nextYear" required="required"/></p>')

        let inputSubmit = $('<p><input type="submit"  value="Submit"/></p>')

        form.append(inputTime);

        form.append(labelColor);
        form.append(inputColor);

        form.append(labelFood);
        form.append(inputFood);

        form.append(labelAnimal);
        form.append(inputAnimal);

        form.append(labelRating);
        form.append(inputRating);

        form.append(labelNextYear);
        form.append(inputNextYear);

        form.append(inputSubmit);

        let resultado = $("body");
        resultado.append(paragraphSuccess)
        resultado.append(form);

    }

}



