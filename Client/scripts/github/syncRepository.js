// ../scripts/github/syncRepository.js
define(['dojo/_base/declare'], function(declare) {
    return declare(null, {
        constructor: function(args) {
            this.aras = args.aras;
            this.item = args.item;
        },
        run: function() {
            var inn = this.aras.getInnovator();
            if (confirm('Sync with GitHub?')) {
                inn.applyMethod('getGitHubRepositories', '')
                    .then(function(result) {
                        alert(result.isError() ?
                            'Error: ' + result.getErrorString() :
                            'Success: ' + result.getResult());
                    });
            }
        }
    });
});
