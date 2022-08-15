const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const url = "http://localhost:7000/shoes";

        const shoes = ref({
            id: null,
            category: "",
            brand: "",
            size: "",
            list: [],
            errorMessage: "",
            isError: false,
            isUpdate: false,
        });

        const getShoes = async () => {
            try {
                shoes.value.isUpdate = false;
                const resShoes = await axios.get(url);
                if (resShoes.data.length === 0)
                    throw new Error("Shoes not found");
                shoes.value.list = resShoes.data;
            } catch (err) {
                shoes.value.isError = true;
                shoes.value.errorMessage = err.message;
                shoes.value.isUpdate = false;
            }
        };

        const getShoesById = async (id) => {
            try {
                const resShoes = await axios.get(url + `/${id}`);
                if ( resShoes.data.length === 0 )
                    throw new Error("Shoes not found");
                shoes.value.isUpdate = true;
                shoes.value.id = id;
                shoes.value.category = resShoes.data.category;
                shoes.value.brand = resShoes.data.brand;
                shoes.value.size = resShoes.data.size;
                return resShoes.data;   
            } catch (err) {
                shoes.value.category = "";
                shoes.value.brand = "";
                shoes.value.size = "";
                shoes.value.isUpdate = false;
                shoes.value.isError = true;
                shoes.value.isError = true;
                shoes.value.errorMessage = err.message;
            }
        };

        const deleteShoes = async (id) => {
            try{
                shoes.value.isUpdate = false;
                const resShoes = await axios.delete(url + "/delete", {
                   data:{
                    id,
                   }, 
                });
                if (resShoes.data.length === 0)
                    throw new Error("Shoes not found");
                shoes.value.list = resShoes.data;
                await getShoes();
                return resShoes.data;
            } catch (err) {
                shoes.value.isError = true;
                shoes.value.errorMessage = err.message;
            }
        };

        const submitShoes = async () => {
            try {
                shoes.value.isUpdate = false;
                const post = await axios.post(url + "/create", {
                    category: shoes.value.category,
                    brand: shoes.value.brand,
                    size: shoes.value.size,
                });
                shoes.value.isError = false;
                shoes.value.category = "";
                shoes.value.brand = "";
                shoes.value.size = "";
                shoes.value.isUpdate = "false";
                if (!post) throw new Error("Failed to make shoes");
                await getShoes();
            } catch (err) {
                shoes.value.isError = true;
                shoes.value.errorMessage = err.message;
            }
        };

        const updateShoes = async () => {
            try {
                shoes.value.isUpdate = true;
                const put = await axios.put(url + "/update", {
                    id: shoes.value.id,
                    category: shoes.value.category,
                    brand: shoes.value.brand,
                    size: shoes.value.size,
                });
                shoes.value.isError = false;
                shoes.value.category = "";
                shoes.value.brand = "";
                shoes.value.size = "";
                shoes.value.isUpdate = false;
                shoes.value.isError = true;
                if (!put) throw new Error("Failed update shoes");
                await getShoes();
            } catch (err) {
                shoes.value.isUpdate = false;
                shoes.value.isError = true;
                shoes.value.errorMessage = err.message;
            }
        };

        onMounted(async () => {
            await getShoes();
        });

        return{
            shoes,
            submitShoes,
            updateShoes,
            deleteShoes,
            getShoesById,
        };
    },
});

app.mount("#app");