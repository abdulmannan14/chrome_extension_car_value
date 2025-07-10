document.addEventListener("DOMContentLoaded", () => {
    function swapper() {
        const tabs = document.querySelectorAll('.sidebar i');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all
                tabs.forEach(i => i.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active to current
                tab.classList.add('active');
                const id = tab.getAttribute('data-tab');
                document.getElementById('tab-' + id).classList.add('active');
            });
        });
    }

    swapper();

});