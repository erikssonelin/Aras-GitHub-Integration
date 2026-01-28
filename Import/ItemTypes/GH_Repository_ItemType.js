var inn = top.aras.getInnovator();

var aml = `<AML>
    <Item type="ItemType" id="GH_Repository" action="add">
        <implementation_type>table</implementation_type>
        <is_dependent>0</is_dependent>
        <is_relationship>0</is_relationship>
        <is_versionable>0</is_versionable>
        <label xml:lang="en">GitHub Repository</label>
        <name>GH_Repository_ItemType</name>

        <!-- Computed Properties -->
        <computed_properties>
            <Item type="ComputedProperty" action="add">
                <name>display_name</name>
                <label xml:lang="en">Display Name</label>
                <data_source>
<![CDATA[
// Modern: Use template string logic without ES6 template literals
var name = this.getProperty("name", "");
var owner = this.getProperty("owner", "");
if (name && owner) {
    return owner + "/" + name;
}
return name || "[No Name]";
]]>
                </data_source>
            </Item>

            <Item type="ComputedProperty" action="add">
                <name>sync_status_display</name>
                <label xml:lang="en">Sync Status</label>
                <data_source>
<![CDATA[
// Modern: Object mapping pattern (ES5 compatible)
var status = this.getProperty("sync_status", "");
var statusMap = {
    "synced": "Synced",
    "error": "Error",
    "rate_limited": "Rate Limited",
    "not_found": "Not Found",
    "": "Not Synced"
};
return statusMap[status] || "Unknown";
]]>
                </data_source>
            </Item>

            <Item type="ComputedProperty" action="add">
                <name>days_since_sync</name>
                <label xml:lang="lang">Days Since Sync</label>
                <data_source>
<![CDATA[
// Modern: Date calculation pattern
var lastSynced = this.getProperty("last_synced", "");
if (!lastSynced) return "Never";
try {
    var syncDate = new Date(lastSynced);
    var now = new Date();
    var diffTime = Math.abs(now - syncDate);
    var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + " day" + (diffDays !== 1 ? "s" : "");
} catch (e) {
    return "Invalid date";
}
]]>
                </data_source>
            </Item>
        </computed_properties>

        <!-- Modern: Search Views for better UX -->
        <search_views>
            <Item type="SearchView" action="add">
                <name>default_search</name>
                <label xml:lang="en">Default View</label>
                <search_item_type>GH_Repository</search_item_type>
                <is_default>1</is_default>
                <search_definition>
<![CDATA[
<Item type="Search" select="display_name,sync_status_display,description,stars,updated_at,days_since_sync">
    <sort_order>
        <Item type="Sort" sort_order="updated_at" sort_dir="descending" />
    </sort_order>
</Item>
]]>
                </search_definition>
            </Item>

            <Item type="SearchView" action="add">
                <name>needs_sync</name>
                <label xml:lang="en">Needs Sync</label>
                <search_item_type>GH_Repository</search_item_type>
                <search_definition>
<![CDATA[
<Item type="Search" select="display_name,sync_status_display,last_synced,days_since_sync">
    <or>
        <sync_status condition="eq">error</sync_status>
        <sync_status condition="eq">rate_limited</sync_status>
        <sync_status condition="eq">not_found</sync_status>
        <last_synced condition="lt">@Yesterday</last_synced>
    </or>
    <sort_order>
        <Item type="Sort" sort_order="sync_status" />
        <Item type="Sort" sort_order="last_synced" sort_dir="ascending" />
    </sort_order>
</Item>
]]>
                </search_definition>
            </Item>
        </search_views>

        <Relationships>
            <!-- GitHub Metadata -->
            <Item type="Property" action="add">
                <data_type>string</data_type>
                <is_required>1</is_required>
                <label xml:lang="en">GitHub ID</label>
                <name>github_id</name>
                <stored_length>64</stored_length>
                <is_indexed>1</is_indexed>  <!-- Modern: Index for faster lookups -->
            </Item>

            <Item type="Property" action="add">
                <data_type>string</data_type>
                <keyed_name_order>1</keyed_name_order>
                <label xml:lang="en">Name</label>
                <name>name</name>
                <stored_length>128</stored_length>
            </Item>

            <Item type="Property" action="add">
                <data_type>text</data_type>
                <label xml:lang="en">Description</label>
                <name>description</name>
                <column_width>300</column_width>  <!-- Modern: Better UI width -->
            </Item>

            <!-- Repository Details -->
            <Item type="Property" action="add">
                <data_type>string</data_type>
                <label xml:lang="en">Full Name</label>
                <name>full_name</name>
                <stored_length>256</stored_length>
            </Item>

            <Item type="Property" action="add">
                <data_type>string</data_type>
                <label xml:lang="en">Owner</label>
                <name>owner</name>
                <stored_length>128</stored_length>
            </Item>

            <Item type="Property" action="add">
                <data_type>string</data_type>
                <label xml:lang="en">Default Branch</label>
                <name>default_branch</name>
                <stored_length>64</stored_length>
            </Item>

            <!-- URLs -->
            <Item type="Property" action="add">
                <data_type>string</data_type>
                <label xml:lang="en">Clone URL</label>
                <name>clone_url</name>
                <stored_length>256</stored_length>
            </Item>

            <Item type="Property" action="add">
                <data_type>string</data_type>
                <label xml:lang="en">HTML URL</label>
                <name>html_url</name>
                <stored_length>256</stored_length>
            </Item>

            <!-- Repository State -->
            <Item type="Property" action="add">
                <data_type>boolean</data_type>
                <label xml:lang="en">Private</label>
                <name>is_private</name>
            </Item>

            <Item type="Property" action="add">
                <data_type>integer</data_type>
                <label xml:lang="en">Stars</label>
                <name>stars</name>
                <column_width>80</column_width>
            </Item>

            <Item type="Property" action="add">
                <data_type>date</data_type>
                <label xml:lang="en">Last Updated</label>
                <name>updated_at</name>
            </Item>

            <!-- Sync Management -->
            <Item type="Property" action="add">
                <data_type>string</data_type>
                <label xml:lang="en">Sync Status</label>
                <name>sync_status</name>
                <stored_length>32</stored_length>
                <default_value>not_synced</default_value>
                <predefined_value_list>synced,error,rate_limited,not_found,not_synced</predefined_value_list>
            </Item>

            <Item type="Property" action="add">
                <data_type>date</data_type>
                <label xml:lang="en">Last Synced</label>
                <name>last_synced</name>
            </Item>

            <Item type="Property" action="add">
                <data_type>string</data_type>
                <is_hidden>1</is_hidden>
                <label xml:lang="en">Sync Hash</label>
                <name>sync_hash</name>
                <stored_length>64</stored_length>
            </Item>
        </Relationships>
    </Item>
</AML>`;

var result = inn.applyAML(aml);
result;
