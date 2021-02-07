<template>
    <modal
            name="category-detail-modal"
            height="auto"
            :draggable="true"
            :classes="['v--modal', 'm-modal']">
        <div class="modal-body">
            <div class="container-fluid">
                <div class="row">
                    <div class="col">
                        <i class="fas fa-times fa-2x btn-modal-close text-success" slot="top-right" @click="$modal.hide('category-detail-modal')"></i>
                        <h4 class="mt-0">{{$t('common.category.components.detail')}}</h4>
                        <hr>
                        <div class="group">
                            <div :class="rowClass">
                                <div :class="colFirstClass">
                                    <b>{{$t('common.category.detail_modal.name')}} :</b>
                                </div>
                                <div :class="colSecondClass">
                                    {{category.name}}
                                </div>
                            </div>
                            <div :class="rowClass">
                                <div :class="colFirstClass">
                                    <b>{{$t('common.category.detail_modal.parent')}} :</b>
                                </div>
                                <div :class="colSecondClass">
                                    {{category.parent.name}}
                                </div>
                            </div>
                            <div :class="rowClass">
                                <div :class="colFirstClass">
                                    <b>{{$t('common.category.detail_modal.created_date')}} :</b>
                                </div>
                                <div :class="colSecondClass">
                                    {{category.parent.created_at}}
                                </div>
                            </div>
                            <div :class="rowClass">
                                <h4>{{$t('common.category.detail_modal.user_detail')}} </h4>
                            </div>
                            <div :class="rowClass">
                                <div :class="childColFirstClass">
                                    <b>{{$t('common.user.input.name')}} :</b>
                                </div>
                                <div :class="childColSecondClass">
                                    <!--{{category && category.user ? category.user.firstname + category.user.firstname + category.user.firstname  : ''}}-->
                                </div>
                            </div>
                            <div :class="rowClass">
                                <div :class="childColFirstClass">
                                    <b>{{$t('common.user.input.email')}} :</b>
                                </div>
                                <div :class="childColSecondClass">
                                    {{category.user.email}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--            <div class="modal-footer">-->
        <!--                <button type="button" class="btn btn-simple btn-sm px-3" @click="$modal.hide('country-modal')">{{$t('common.close')}}</button>-->
        <!--                <button type="button" class="btn btn-primary btn-sm btn-round btn-fill px-4" @click="saveCity">{{$t('common.buttons.save')}}</button>-->
        <!--            </div>-->
    </modal>
</template>

<script>

  export default {
    props:['category'],

    data(){
      return {
        colFirstClass : 'col ',
        colSecondClass : 'col-9 ',
        childColFirstClass : 'col',
        childColSecondClass : 'col-9',
        rowClass : 'row pl-3 pr-3 pb-3'
      }
    }
  }
</script>
