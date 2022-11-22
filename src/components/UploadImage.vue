<template>
   <div id="uploadImage">
      <img v-if="uploaded" :src="previewImage" class="profilePic" />
      <label class="chooseFile">
        <input type="file" accept="image/jpeg" @change=uploadImage>
        Upload Image 
      </label>
   </div>
</template>

<script>
    export default {
        name:'UploadImage',
        data(){
            return{
                uploaded:false,
                previewImage:null
            }
        },
        methods:{
            uploadImage(e){
                const image = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(image);
                this.uploaded = true;
                reader.onload = e =>{
                    this.previewImage = e.target.result;
                };
            }
        }
     }  
</script>

<style scoped>
#uploadImage {
    margin-top: 5px;
}
.profilePic{
    display:flex;
    width: 100px;
    height: 100px;
    border: none;
    margin-bottom: 10px;
}
input[type="file"] {
    display: none;
}
label {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 5px 100px;
    background-color: #F8D57E;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}
label:hover{
    background-color: #fcca4c;
}
label:active {
    opacity: 0.6;
    transform: translateY(3px);
}
 </style>