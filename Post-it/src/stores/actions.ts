import {ref,onMounted} from 'vue' ;
 import axios from 'axios';

 const posts = ref([]);
 const loading = ref(true) ;
 const error = ref('');

 onMounted(async () => {
    try{
        const response = await axios.get('https://postit.zoul.dev/notes');
        posts.value = response.data.notes ;
        console.log(response.data)
    }catch(err){
        error.value = err.message || 'Something went wrong';
    }finally{
        loading.value ;
    }
 })