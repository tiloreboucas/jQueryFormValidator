var formValidatorCurrency = "R$";

(function ($) {
    $.fn.formvalidator = function (method) {

        var options = null;
        var methodName = '';
        var params = [];

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
        }

        var attr = {
            target: '',
            container: '',
            callback: function () { $.noop() },
            valid: false,
            group: null,
            securitylock: true,
            keypress: false
        };

        var methods = {
            init: function (options) {
                var $this = this;

                $this.attr = $.extend(true, {}, attr, options);
                $this.attr.target = $(this);
                $this.attr.group = $($this.attr.target).find('.required');
                $($this.attr.target).find('.required').each(function (index, item) {
                    $(item).keyup(function () {
                        methods.testItem.call($this, item);
                        methods.setValidationStatus.call($this);
                    });

                    $(item).focusout(function () {
                        methods.testItem.call($this, item);
                        methods.setValidationStatus.call($this);
                    });

                    $(item).change(function () {
                        methods.testItem.call($this, item);
                        methods.setValidationStatus.call($this);
                    });
                });

                $($this.attr.target).find('.preset').each(function (index, item) {
                    var filter = null;
                    var mode = null;
                    var mask = null;
                    
                    /*
                    if($this.attr.securitylock) {
                        $(item).keydown(function() {
                            if($this.attr.keypress) {
                                return false;
                            } else {
                               $this.attr.keypress = true;
                            }
                        });    

                        $(item).keyup(function() {
                            $this.attr.keypress = false;
                        });
                    }
                    */
                    
                    if ($(item).hasClass('integer')) {
                        mode = 'tipoA';
                        filter = new RegExp(/^[0-9]+$/);
                    } else if ($(item).hasClass('float')) {
                        mode = 'tipoA';
                        filter = new RegExp(/(^\$?([1-9]{1}[0-9]{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\$?([1-9]{1}\d{0,2}(\.\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\.\d{1,2}))\)$)/);
                    } else if ($(item).hasClass('email')) {
                        mode = 'tipoB';
                        filter = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
                    } else if ($(item).hasClass('site')) {
                        mode = 'tipoB';
                        filter = new RegExp('^(http[s]?://|ftp://)?(www\.)?[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov|br)$');
                    } else if ($(item).hasClass('cnpj')) {
                        mode = 'tipoC';
                        filter = new RegExp('^[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{3}[0-9]{1}-[0-9]{2}$');

                        $(item).keydown(function (event) {
                            if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                if ($(item)[0].value.length == 2) {
                                    $(item)[0].value = $(item)[0].value + '.';
                                } else if ($(item)[0].value.length == 6) {
                                    $(item)[0].value = $(item)[0].value + '.';
                                } else if ($(item)[0].value.length == 10) {
                                    $(item)[0].value = $(item)[0].value + '/';
                                } else if ($(item)[0].value.length == 15) {
                                    $(item)[0].value = $(item)[0].value + '-';
                                }
                            }
                        });

                        var isNumber = new RegExp(/^[0-9]+$/);

                        $(item).keyup(function (event) {
                            var isNumber = new RegExp(/^[0-9]+$/);
                            if (!isNumber.test($(item)[0].value[$(item)[0].value.length - 1])) {
                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                $(item).val(newVal);
                            }
                        });
						
						
                    } else if ($(item).hasClass('phone')) {
                        mode = 'tipoC';
                        filter = new RegExp(/^(\([0-9]{2}\))\s([0-9]{4,5})-([0-9]{4})$/);
                        var isNumber = new RegExp(/^[0-9]+$/);

                        $(item).keyup(function (event) {
                            if (event.which != 16 && event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                if ($(item)[0].value[0] != "(") {
                                    $(item)[0].value = '(' + $(item)[0].value;
                                }
                                var isNumber = new RegExp(/^[0-9]+$/);
                                if (!isNumber.test($(item)[0].value[$(item)[0].value.length - 1])) {
                                    var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                    $(item).val(newVal);
                                }
                            }
                        });

                        $(item).keydown(function (event) {
                            if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                if ($(item)[0].value.length == 0) {
                                    $(item)[0].value = '(' + $(item)[0].value;
                                } else if ($(item)[0].value.length == 3) {
                                    $(item)[0].value = $(item)[0].value + ') ';
                                } else if ($(item)[0].value.length == 9) {
                                    if (!(($(item)[0].value[1] == 1) && ($(item)[0].value[2] == 1) && ($(item)[0].value[5] == 9))) {
                                        $(item)[0].value = $(item)[0].value + '-';
                                        $(item).attr('maxlength', '14');
                                    }
                                } else if ($(item)[0].value.length == 10) {
                                    if ((($(item)[0].value[1] == 1) && ($(item)[0].value[2] == 1) && ($(item)[0].value[5] == 9))) {
                                        $(item)[0].value = $(item)[0].value + '-';
                                        $(item).attr('maxlength', '15');
                                    }
                                }
                            }
                        });
                    } else if ($(item).hasClass('cep')) {
                        mode = 'tipoC';
                        filter = new RegExp("^([0-9]{5})-([0-9]{3})$");

                        $(item).keydown(function () {
                            if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                if ($(item)[0].value.length == 5) {
                                    $(item)[0].value = $(item)[0].value + '-';
                                }
                            }
                        });

                        var isNumber = new RegExp(/^[0-9]+$/);

                        $(item).keyup(function (event) {
                            var isNumber = new RegExp(/^[0-9]+$/);
                            if (!isNumber.test($(item)[0].value[$(item)[0].value.length - 1])) {
                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                $(item).val(newVal);
                            }
                        });

                    } else if ($(item).hasClass('shortDate')) {
                        mode = 'tipoC';
                        filter = new RegExp("^([1-3]{0,1})?([0-9]{1})/([1]{0,1})?([0-9]{1})$");

                        $(item).keydown(function () {
                            if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                if ($(item)[0].value.length == 2) {
                                    $(item)[0].value = $(item)[0].value + '/';
                                }
                            }
                        });

                        var isNumber = new RegExp(/^[0-9]+$/);

                        $(item).keyup(function (event) {
                            var isNumber = new RegExp(/^[0-9]+$/);
                            if (!isNumber.test($(item)[0].value[$(item)[0].value.length - 1])) {
                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                $(item).val(newVal);
                            }
                        });

                    } else if ($(item).hasClass('longDate')) {
                        mode = 'tipoC';
                        filter = new RegExp("^([1-3]{0,1})?([0-9]{1})/([1]{0,1})?([0-9]{1})/([0-9]{4})$");

                        $(item).keydown(function () {
                            if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                if ($(item)[0].value.length == 2) {
                                    $(item)[0].value = $(item)[0].value + '/';
                                } else if ($(item)[0].value.length == 5) {
                                    $(item)[0].value = $(item)[0].value + '/';
                                }
                            }
                        });

                        var isNumber = new RegExp(/^[0-9]+$/);

                        $(item).keyup(function (event) {
                            var isNumber = new RegExp(/^[0-9]+$/);
                            if (!isNumber.test($(item)[0].value[$(item)[0].value.length - 1])) {
                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                $(item).val(newVal);
                            }
                        });
                    } else if ($(item).hasClass('currency')) {
                        $(item).css({'text-align': 'right'});
                        
                        $(item).focusin(function(){
                            if(item.value == ""){
                                item.value = "0,00";
                            } else {
                                // Remove Cifrão
                                item.value = item.value.substring(3, item.value.length);
                            }

                            setTimeout(function(){ item.setSelectionRange(item.value.length, item.value.length + 1); }, 0);
                        });

                        $(item).focusout(function(){
                            if(item.value == "0,00"){
                                item.value = "";
                            } else {
                                // Insere Cifrão
                                if(item.value != "" && item.value.search(formValidatorCurrency + ' ') == -1) item.value = formValidatorCurrency + ' ' + item.value;
                            }
                        });

                        $(item).keypress(function(e){
                            if (e.ctrlKey && e.which == 86) this.pasting = true;
                            if (e.shiftKey && e.which == 45) this.pasting = true;

                            if (this.pasting) {
                                this.pasting = false;
                                return true;
                            }
                            
                            e = e || window.event;
                            if (e.charCode == 0) return true;
                            var s = String.fromCharCode(e.charCode);
                            if (s < '0' || s > '9') return false;
                            
                            return true;
                        });
                        
                        $(item).keydown(function(e){
                            if (item.value == '0,00' && e.which == 8) return false;
                            
                            if(e){
                                var x = item.value.replace(/,/gi,'');
                                var v = x.replace(/\./gi,'');

                                var newVal = "";
                                var val0 = "";
                                var val1 = "";

                                if(e.which != 8) {
                                    // Escrevendo

                                    if(v[0] == 0) {
                                        newVal = v.substring(1, v.length);
                                        val0 = newVal.substring(0, v.length - 2);
                                        val1 = newVal.substring(v.length - 2);
                                    } else {
                                        val0 = v.substring(0, v.length - 1);
                                        val1 = v.substring(v.length - 1);
                                    }
                                    
                                    newVal = val0 + "," + val1;

                                    item.value = newVal;
                                } else {
                                    // Apagando
       
                                    if(v.length == 3) {
                                        newVal = v.substring(0, v.length);
                                        val0 = "0";
                                        val1 = v;
                                    } else {
                                        newVal = v.substring(0, v.length);
                                        val0 = v.substring(0, v.length - 3);
                                        val1 = v.substring(v.length - 3);
                                    }
                                    
                                    newVal = val0 + "," + val1;

                                    item.value = newVal;
                                }

                                var d = item.value.split(",");
                                newVal = "";

                                if(d[0].length > 3){
                                    for(var i = d[0].length; i > 0; i = i - 3){ 
                                        if(i == d[0].length) {
                                            newVal = d[0].substring(i-3, i) + "" + newVal;
                                        } else { 
                                            newVal = d[0].substring(i-3, i) + "."+ newVal;
                                        } 
                                    }

                                    item.value = newVal + "," + d[1];
                                }
                            }
                        });

                        $(item).keyup(function(e){
                            var x = item.value.replace(/,/gi,'');
                            var v = x.replace(/\./gi,'');

                            var newVal = "";
                            var val0 = "";
                            var val1 = "";

                            val0 = v.substring(0, v.length - 2);
                            val1 = v.substring(v.length - 2);

                            newVal = val0 + "," + val1;

                            item.value = newVal;

                            var d = item.value.split(",");
                            newVal = "";

                            if(d[0].length > 3){
                                for(var i = d[0].length; i > 0; i = i - 3){ 
                                    if(i == d[0].length) {
                                        newVal = d[0].substring(i-3, i) + "" + newVal;
                                    } else { 
                                        newVal = d[0].substring(i-3, i) + "."+ newVal;
                                    } 
                                }

                                item.value = newVal + "," + d[1];
                            }
                        });
                    }

                    if (mode == 'tipoA') {
                        // Inteiro
                        if ($(item).hasClass('integer')) {
                            if ($(item).hasClass('greater_zero')) {
                                filterFirst = new RegExp(/^[1-9]+$/);
                                filter = new RegExp(/^[0-9]+$/);

                                $(item).keyup(function () {
                                    if (event.which != 16 && event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                        if ($(item)[0].value.length == 1) {
                                            if (!filterFirst.test($(item).val())) {
                                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                                $(item).val(newVal);
                                            }
                                        } else {
                                            if (!filter.test($(item).val())) {
                                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                                $(item).val(newVal);
                                            }
                                        }
                                    }
                                });
                            } else {
                                filter = new RegExp(/^[0-9]+$/);
                                $(item).keyup(function () {
                                    if (!filter.test($(item).val())) {
                                        var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                        $(item).val(newVal);
                                    }
                                });
                            }
                        }

                        // Float
                        if ($(item).hasClass('float')) {
                            if ($(item).hasClass('greater_zero')) {
                                filterFirst = new RegExp(/^[1-9]+$/);
                                filter = new RegExp(/(^\$?([1-9]{1}[0-9]{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\$?([1-9]{1}\d{0,2}(\.\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\.\d{1,2}))\)$)/);

                                $(item).keyup(function () {
                                    if (event.which != 16 && event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                                        if ($(item)[0].value.length == 1) {
                                            if (!filterFirst.test($(item).val())) {
                                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                                $(item).val(newVal);
                                            }
                                        } else {
                                            if (!filter.test($(item).val())) {
                                                var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                                $(item).val(newVal);
                                            }
                                        }
                                    }
                                });
                            } else {
                                filter = new RegExp(/(^\$?([1-9]{1}[0-9]{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\$?([1-9]{1}\d{0,2}(\.\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\.\d{1,2}))\)$)/);
                                $(item).keyup(function () {
                                    if (!filter.test($(item).val())) {
                                        var newVal = $(item).val().substring(0, $(item).val().length - 1);
                                        $(item).val(newVal);
                                    }
                                });
                            }
                        }
                    } else if (mode == 'tipoB' || mode == 'tipoC') {
                        $(item).focusout(function () {
                            if ($(item).val() != "") {
                                if (!filter.test($(item).val())) {   
                                    if (!$(item).hasClass('preseterror')) {
                                        $(item).addClass('preseterror').removeClass('presetvalidated');
                                        $(item).parent().append('<label class="preseterror">Formato inválido</label>');
                                    }
                                } else {
                                    if ($(item).hasClass('preseterror')) {
                                        $(item).removeClass('preseterror').addClass('presetvalidated');
                                        var label = $(item).parent().find('label.preseterror');
                                        $(label).remove();
                                    }
                                }
                            } else {
                                if ($(item).hasClass('preseterror')) {
                                    $(item).removeClass('preseterror').addClass('presetvalidated');
                                    var label = $(item).parent().find('label.preseterror');
                                    $(label).remove();
                                }
                            }
                        });
                    }
                });
            },

            validationGroup: function () {
                var $this = this;

                $($this.attr.target).find('.required').each(function (index, item) {
                    methods.testItem.call($this, item);
                });

                methods.setValidationStatus.call($this);
            },

            testItem: function (item) {
                var $this = this;

                if (($(item)[0].type == 'radio') || ($(item)[0].type == 'checkbox')) {
                    var strQuery = $(item).attr('name');
                    var radioStatus = false;
                    $('input[name="' + strQuery + '"]').each(function (i, item) {
                        if (item.checked) radioStatus = true;
                    });

                    $('input[name="' + strQuery + '"]').each(function (i, item) {
                        if (radioStatus) {
                            $(item).removeClass('error').addClass('validated');
                            if (i == ($('input[name="' + strQuery + '"]').size() - 1)) {
                                var label = $(item).parent().find('label.error');
                                $(label).remove();
                            }
                        } else {
                            $(item).addClass('error').removeClass('validated');
                            if ((i == ($('input[name="' + strQuery + '"]').size() - 1)) && ($(item).parent().find('label.error').size() == 0)) {
                                $(item).parent().append('<label class="error">Este item é obrigatório!</label>')
                            }
                        }
                    });
                } else if ($(item)[0].type == 'hidden' && $(item).hasClass('customselect')) {
                    if ($(item).val() == '' || $(item).val() == '0') {
                        if (!$(item).parent().parent().hasClass('error')) {
                            $(item).parent().parent().addClass('error').removeClass('validated');
                            $(item).addClass('error').removeClass('validated');
                            $(item).parent().parent().parent().append('<label class="error">Este item é obrigatório!</label>')
                        }
                    } else {
                        $(item).parent().parent().removeClass('error').addClass('validated');
                        $(item).removeClass('error').addClass('validated');
                        var label = $(item).parent().parent().parent().find('label.error');
                        $(label).remove();
                    }
                } else {
                    if ($(item).val() == '') {
                        if (!$(item).hasClass('error')) {
                            $(item).addClass('error').removeClass('validated');
                            $(item).parent().append('<label class="error">Este item é obrigatório!</label>')
                        }
                    } else {
                        if ($(item).hasClass('error')) {
                            $(item).removeClass('error').addClass('validated');
                            var label = $(item).parent().find('label.error');
                            $(label).remove();
                        } else {
                            $(item).addClass('validated');
                        }
                    }
                }
            },

            setValidationStatus: function () {
                var $this = this;

                if ($($this.attr.target).find('.required').size() == $($this.attr.target).find('.required.validated').size()) {
                    $this.attr.valid = true;
                } else {
                    $this.attr.valid = false;
                }
            },

            clearForm: function () {
                var $this = this;

                $($this.attr.target).find('.required').removeClass('validated').removeClass('error');

                $($this.attr.target).find('label.error').remove();

                $($this.attr.target).find('.customselect_main.error').removeClass('validated').removeClass('error');

                $this.attr.valid = false;
            }
        };

        if (methodName != '') {
            if (methods[methodName]) {
                return this.each(function () {
                    methods[methodName].call(this, params);
                });
            } else {
                $.error("Method '" + methodName + "' does not exist on jQuery.FormValidator");
                return;
            }
        }

        return this.each(function () {
            methods.init.call(this, options);
        });
    };
})(jQuery);