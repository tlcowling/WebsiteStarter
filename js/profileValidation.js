/*
    Ryan Oglesby

    Inline Validation:

    Classes:
        required: validate_required
        length: validate_length_of
        numeric: validate_numeric
        email: validate_email
        date: validate_date_dropdown (This is for the rails date_select boxes

    Other attributes:
        validate-length: {x} --> Required with "validation_length_of"
        validate-insert-msg-after: {id} --> Use this to insert the valid/invalid message after a specific element
 */

var validators = {};
var defaultValidatorOptions = {
    validMessage: " "
}

function createLiveValidationOptionFromElementAttribute(element) {
    return {
        insertAfterWhatNode : element.attr("validate-insert-msg-after")
    };
}

function validatorForElement(id) {
    if( validators[id] ) {
        return validators[id];
    }

    var elementOptions = createLiveValidationOptionFromElementAttribute($("#"+id));
    options = $.extend(defaultValidatorOptions, elementOptions);

    validators[id] = new LiveValidation(id, options);

    return validators[id];
}


$(document).ready(function() {

    // Remove the employee id field dynamically for the showcase
    $("#profile_employee_id").parent().parent().remove();

    $(".validate_required").each(function() {
        var id = $(this).attr("id");

        var validationObject = validatorForElement(id);
        validationObject.add(Validate.Presence, {failureMessage: "Required."});
    });

    $(".validate_numeric").each(function() {
        var id = $(this).attr("id");

        var validationObject = validatorForElement(id);
        validationObject.add(Validate.Numericality , {
            onlyInteger: true,
            notANumberMessage: "Must be a number.",
            notAnIntegerMessage: "Must be an integer."
        });
    });

    $(".validate_length_of").each(function() {
        var id = $(this).attr("id");
        var length = $(this).attr("validate-length");

        var validationObject = validatorForElement(id);
        validationObject.add(Validate.Length, {
            is: length,
            wrongLengthMessage: "Must be " + length + " characters long."}
        );
    });

    $(".validate_email").each(function() {
        var id = $(this).attr("id");

        var validationObject = validatorForElement(id);
        validationObject.add(Validate.Email, {failureMessage: "Must be a valid email address."});
    });

    $(".validate_date_dropdown").each(function() {
        var id = $(this).attr("id");

        var shared_id = id.substring(0, id.length-3);

        var validationObject = validatorForElement(id);
        validationObject.add(Validate.Custom, {
            against: function(value,args) {
                var day = $("#"+args.shared_id+"_3i").val();
                var month = $("#"+args.shared_id+"_2i").val() - 1; // Months in Javascript start at 0
                var year = $("#"+args.shared_id+"_1i").val();

                var date = new Date(year, month, day);

                if (date.getFullYear() != year || date.getMonth() != month || date.getDate() != day) {
                    return false;
                }

                return true;

            },
            args: {shared_id: shared_id},
            failureMessage: "Must be a valid date."
        });

        $('select[id*="'+shared_id+'"]').chanage( function() {
            var sibling_selects = $('select[id*="'+shared_id+'"]');

            if( $(this).hasClass(validationObject.validFieldClass) ) {
                sibling_selects.removeClass(validationObject.validFieldClass);
                sibling_selects.removeClass(validationObject.invalidFieldClass);

                sibling_selects.addClass(validationObject.validFieldClass);
            }
            else if ( $(this).hasClass(validationObject.invalidFieldClass) ) {
                sibling_selects.removeClass(validationObject.validFieldClass);
                sibling_selects.removeClass(validationObject.invalidFieldClass);

                sibling_selects.addClass(validationObject.invalidFieldClass);
            }
        });
    });
});
                             