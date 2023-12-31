import { ref } from 'vue';
import { TZHFormModal } from "@/components/zh-form-modal/type";
import { ipcRenderer } from 'electron';
import { RefSymbol } from '@vue/reactivity';
import { popErrorMessage } from '@/components/zh-message';
import { TZHformConfig } from '@/components/zh-form/type';
import ZHRequest from '@/components/zh-request';
import api from '@/api';
import { TZHRequestParams } from '@/components/zh-request/type';

export default class CreateWorkspaceFormModal {
    refWorkspaceTree: any;
    constructor(refWorkspaceTree:any) {
        this.refWorkspaceTree = refWorkspaceTree;
    };

    modalConfig = ref({
        show: false,
        width: '500px',
        title: '新建工作区',
        footer: {
            hasCancelButton: true,
            hasSubmitButton: true,
        },
    });

    formConfig = ref({
        formLabelWidth: '100px',
        // customValidate: (model:any) => {
        //     var path = new RegExp("^[A-z]:\\\\(.+?\\\\)*$");
        //     if (!path.test(model.address)) {
        //         popErrorMessage('请输入正确的路径');
        //         return false;
        //     }
        //     return true;
        // },
        fields: [
            { prop: 'workspaceName', label: '工作区名称', type: 'input', span: 24, required: true, },
            { prop: 'englishName', label: '英文名称', type: 'input', span: 24, required: true, },
            {
                prop: 'address', label: '工作区路径', type: 'input', span: 24, 
                refName: 'refInput', appendSuffixIcon: 'folderOpened',
                clickAppendSuffixIcon: async (e: any, item: any, model: any, ref: any) => {
                    const res = ipcRenderer.sendSync('dialog:chooseFolder');
                    model.address = res && res.filePaths && res.filePaths[0];
                }
            },
        ],
    } as TZHformConfig);


    model = ref({});

    close = () => {
        this.model.value = {};
        this.modalConfig.value.show = false;
    };

    submit = async () => {
        const params:TZHRequestParams = { url: api.addWorkspace, conditions: this.model.value };
        const res = await ZHRequest.post(params);
        if (res.success) {
            this.close();
            this.refWorkspaceTree.value.getTreeData();
        } else {
            popErrorMessage(res.error);
        }
    };
}