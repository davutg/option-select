myApp.
constant('PI', 3.14159265359).
value('val', 123).
factory('fact', function () { return 123; }).
directive('directiveName', directiveFn).
directive('jumbo', jumboFn).
filter('filt', filterFn).
service('serv', sharedPropertyService).
controller('cheatController',['PI','val','fact','serv',cheatController]);

function cheatController(p,v,f,s)
{
    var vm=this;
    vm.PI=p;
    vm.val=v;
    vm.fact=f;
    vm.serv=s;
}

function sharedPropertyService()
{
    var property = {res:"default"};

    return {
        getProperty: function () {
            return property;
        }
        ,
        setProperty: function (p) {
            property.res=p;
        }
    };

}

function directiveFn() {
    return{
        restrict: 'E',
        scope:
        {
            header:"@?"
        },
        template:"<i class='w3-jumbo'>{{header}}</i>"
    }
}

function jumboFn()
{
     return{
        restrict: 'A',               
           link: function link(scope, element, attrs, controller, transcludeFn)
         {
             element[0].className+="w3-jumbo";
            //element[0].innerHTML="<i class='w3-jumbo'>"+element[0].innerText+"</i>";
         }
    }
}

function filterFn() {
    return function(input, param)
    {
        if(input && param)
            {
                if(input.toString().length>param)
                    return input.toString().substring(0,param);
            }
        return input;
    }
}