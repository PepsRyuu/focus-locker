(function () {
    
    var Modal = function (options) {
        this.el = document.createElement('div');
        this.el.innerHTML = [
            '<div class="Modal">',
            '   <div class="Modal-background"></div>',
            '   <div class="Modal-dialog">',
            '       <div class="Modal-content"></div>',
            '   </div>',
            '</div>'
        ].join('\n');

        this.el.querySelector('.Modal-content').appendChild(options.content);
        document.body.appendChild(this.el);

        FocusLocker.request(this.el);
    };

    Modal.prototype.close = function () {
        this.el.remove();
        FocusLocker.release();
    };

    window.Modal = Modal;

})();