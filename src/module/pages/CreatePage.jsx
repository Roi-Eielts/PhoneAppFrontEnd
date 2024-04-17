const CreateProduct  = () => {
    const [name, setName] = useState('');
    const [barCode, setBarcode] = useState('');
    const [ammount, setAmmoumt] = useState('');


    return (
        <View>
            <TextInput
                    placeholder='Product naam'
                    onChangeText={(text) => { setName(text) }}
                    value={name}
                />
                 <TextInput
                    placeholder='Product hoeveelheid'
                    onChangeText={(text) => { setAmmoumt(text) }}
                    value={name}
                />
                 <TextInput
                    placeholder='Product naam'
                    onChangeText={(text) => { setName(text) }}
                    value={name}
                />
        </View>
    );
}

export default CreateProduct;