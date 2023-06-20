import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
Vue.component('data-table', {
    render: function (createElement) {
        return createElement(
            "table", null, []
        )
    },
    props: ['comments'],
    data() {
        return {
            headers: [
                { title: 'Name' },
                { title: 'Email' },
                { title: 'Body' },
            ],
            rows: [] ,
            dtHandle: null
        }
    },
    watch: {
        comments(val, oldVal) {
            let vm = this;
            vm.rows = [];
            val.forEach(function (item) {
                let row = [];
                row.push(item.name);
                row.push('<a href="mailto://' + item.email + '">' + item.email + '</a>');
                row.push(item.body);
                vm.rows.push(row);
            });
            vm.dtHandle.clear();
            vm.dtHandle.rows.add(vm.rows);
            vm.dtHandle.draw();
        }
    },
    mounted() {
        let vm = this;
        vm.dtHandle = $(this.$el).DataTable({
            columns: vm.headers,
            data: vm.rows,
            searching: true,
            paging: true,
            info: false
        });
    }
});

new Vue({
    el: '#tabledemo',
    data: {
        comments: [],
        search: ''
    },
    computed: {
        filteredComments: function () {
            let self = this
            let search = self.search.toLowerCase()
            return self.comments.filter(function (comments) {
                return  comments.name.toLowerCase().indexOf(search) !== -1 ||
                    comments.email.toLowerCase().indexOf(search) !== -1 ||
                    comments.body.toLowerCase().indexOf(search) !== -1
            })
        }
    },
    mounted() {
        let vm = this;
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/comments',
            success(res) {
                vm.comments = res;
            }
        });
    }
});