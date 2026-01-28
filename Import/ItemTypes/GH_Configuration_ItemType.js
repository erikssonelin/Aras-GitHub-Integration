var inn = top.aras.getInnovator();

var aml = `<AML>
    <Item type="ItemType" id="GH_Configuration" action="add">
        <implementation_type>table</implementation_type>
        <is_dependent>0</is_dependent>
        <core>0</core>
        <label xml:lang="en">GitHub Configuration</label>
        <name>GH_Configuration_ItemType</name>
        <Relationships>
            <Item type="Property" action="add">
                <data_type>string</data_type>
                <is_required>1</is_required>
                <label xml:lang="en">GitHub Token</label>
                <name>github_token</name>
                <stored_length>256</stored_length>
                <is_hidden>0</is_hidden>
                <is_hidden2>1</is_hidden2>
            </Item>

            <Item type="Property" action="add">
                <data_type>string</data_type>
                <label xml:lang="en">GitHub API URL</label>
                <name>api_url</name>
                <stored_length>256</stored_length>
                <default_value>https://api.github.com</default_value>
            </Item>

            <Item type="Property" action="add">
                <data_type>string</data_type>
                <is_required>1</is_required>
                <label xml:lang="en">Organization/Username</label>
                <name>github_user</name>
                <stored_length>128</stored_length>
            </Item>
        </Relationships>
    </Item>
</AML>`;

var result = inn.applyAML(aml);
result;
