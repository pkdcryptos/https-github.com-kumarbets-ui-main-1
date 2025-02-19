<template>
  <div class="column content-box">
    <woot-modal-header
      :header-title="$t('CAMPAIGN.ADD.TITLE')"
      :header-content="$t('CAMPAIGN.ADD.DESC')"
    />
    <form class="row" @submit.prevent="addCampaign">
      <div class="medium-12 columns">
        <woot-input
          v-model="title"
          :label="$t('CAMPAIGN.ADD.FORM.TITLE.LABEL')"
          type="text"
          :class="{ error: $v.title.$error }"
          :error="$v.title.$error ? $t('CAMPAIGN.ADD.FORM.TITLE.ERROR') : ''"
          :placeholder="$t('CAMPAIGN.ADD.FORM.TITLE.PLACEHOLDER')"
          @blur="$v.title.$touch"
        />

        <label :class="{ error: $v.message.$error }">
          {{ $t('CAMPAIGN.ADD.FORM.MESSAGE.LABEL') }}
          <textarea
            v-model="message"
            rows="5"
            type="text"
            :placeholder="$t('CAMPAIGN.ADD.FORM.MESSAGE.PLACEHOLDER')"
            @blur="$v.message.$touch"
          />
          <span v-if="$v.message.$error" class="message">
            {{ $t('CAMPAIGN.ADD.FORM.MESSAGE.ERROR') }}
          </span>
        </label>

        <label v-if="isOnOffType">
          {{ $t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.LABEL') }}
          <woot-date-time-picker
            :value="scheduledAt"
            :confirm-text="$t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.CONFIRM')"
            :placeholder="$t('CAMPAIGN.ADD.FORM.SCHEDULED_AT.PLACEHOLDER')"
            @change="onChange"
          />
        </label>

        <label
          v-if="isOnOffType"
          :class="{ error: $v.selectedAudience.$error }"
        >
          {{ $t('CAMPAIGN.ADD.FORM.AUDIENCE.LABEL') }}
          <multiselect
            v-model="selectedAudience"
            :options="audienceList"
            track-by="id"
            label="title"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :hide-selected="true"
            :placeholder="$t('CAMPAIGN.ADD.FORM.AUDIENCE.PLACEHOLDER')"
            selected-label
            :select-label="$t('FORMS.MULTISELECT.ENTER_TO_SELECT')"
            :deselect-label="$t('FORMS.MULTISELECT.ENTER_TO_REMOVE')"
            @blur="$v.selectedAudience.$touch"
            @select="$v.selectedAudience.$touch"
          />
          <span v-if="$v.selectedAudience.$error" class="message">
            {{ $t('CAMPAIGN.ADD.FORM.AUDIENCE.ERROR') }}
          </span>
        </label>

        <label
          v-if="isOngoingType"
          :class="{ error: $v.selectedSender.$error }"
        >
          {{ $t('CAMPAIGN.ADD.FORM.SENT_BY.LABEL') }}
          <select v-model="selectedSender">
            <option
              v-for="sender in sendersAndBotList"
              :key="sender.name"
              :value="sender.id"
            >
              {{ sender.name }}
            </option>
          </select>
          <span v-if="$v.selectedSender.$error" class="message">
            {{ $t('CAMPAIGN.ADD.FORM.SENT_BY.ERROR') }}
          </span>
        </label>

        <woot-input
          v-if="isOngoingType"
          v-model="endPoint"
          :label="$t('CAMPAIGN.ADD.FORM.END_POINT.LABEL')"
          type="text"
          :class="{ error: $v.endPoint.$error }"
          :error="
            $v.endPoint.$error ? $t('CAMPAIGN.ADD.FORM.END_POINT.ERROR') : ''
          "
          :placeholder="$t('CAMPAIGN.ADD.FORM.END_POINT.PLACEHOLDER')"
          @blur="$v.endPoint.$touch"
        />
        <woot-input
          v-if="isOngoingType"
          v-model="timeOnPage"
          :label="$t('CAMPAIGN.ADD.FORM.TIME_ON_PAGE.LABEL')"
          type="text"
          :class="{ error: $v.timeOnPage.$error }"
          :error="
            $v.timeOnPage.$error
              ? $t('CAMPAIGN.ADD.FORM.TIME_ON_PAGE.ERROR')
              : ''
          "
          :placeholder="$t('CAMPAIGN.ADD.FORM.TIME_ON_PAGE.PLACEHOLDER')"
          @blur="$v.timeOnPage.$touch"
        />
        <label v-if="isOngoingType">
          <input
            v-model="enabled"
            type="checkbox"
            value="enabled"
            name="enabled"
          />
          {{ $t('CAMPAIGN.ADD.FORM.ENABLED') }}
        </label>
      </div>

      <div class="modal-footer">
        <woot-button
          :is-disabled="buttonDisabled"
          :is-loading="uiFlags.isCreating"
        >
          {{ $t('CAMPAIGN.ADD.CREATE_BUTTON_TEXT') }}
        </woot-button>
        <woot-button variant="clear" @click.prevent="onClose">
          {{ $t('CAMPAIGN.ADD.CANCEL_BUTTON_TEXT') }}
        </woot-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required, url, minLength } from 'vuelidate/lib/validators';
import alertMixin from 'dashboard/mixins/alertMixin';
import campaignMixin from 'dashboard/mixins/campaignMixin';
import WootDateTimePicker from 'dashboard/components/ui/DateTimePicker.vue';

export default {
  components: { WootDateTimePicker },
  mixins: [alertMixin, campaignMixin],
  props: {
    senderList: {
      type: Array,
      default: () => [],
    },
    audienceList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      title: '',
      message: '',
      selectedSender: 0,
      endPoint: '',
      timeOnPage: 10,
      show: true,
      enabled: true,
      scheduledAt: null,
      selectedAudience: [],
    };
  },

  validations: {
    title: {
      required,
    },
    message: {
      required,
    },
    selectedSender: {
      required,
    },
    endPoint: {
      required,
      minLength: minLength(7),
      url,
    },
    timeOnPage: {
      required,
    },
    selectedAudience: {
      isEmpty() {
        return !!this.selectedAudience.length;
      },
    },
  },
  computed: {
    ...mapGetters({
      uiFlags: 'campaigns/getUIFlags',
    }),
    currentInboxId() {
      return this.$route.params.inboxId;
    },
    inbox() {
      return this.$store.getters['inboxes/getInbox'](this.currentInboxId);
    },
    buttonDisabled() {
      if (this.isOngoingType) {
        return (
          this.$v.message.$invalid ||
          this.$v.title.$invalid ||
          this.$v.selectedSender.$invalid ||
          this.$v.endPoint.$invalid ||
          this.$v.timeOnPage.$invalid ||
          this.uiFlags.isCreating
        );
      }
      return (
        this.$v.message.$invalid ||
        this.$v.title.$invalid ||
        this.$v.selectedAudience.$invalid ||
        this.uiFlags.isCreating
      );
    },
    sendersAndBotList() {
      return [
        {
          id: 0,
          name: 'Bot',
        },
        ...this.senderList,
      ];
    },
  },
  methods: {
    onClose() {
      this.$emit('on-close');
    },
    onChange(value) {
      this.scheduledAt = value;
    },
    getCampaignDetails() {
      let campaignDetails = null;
      if (this.isOngoingType) {
        campaignDetails = {
          title: this.title,
          message: this.message,
          inbox_id: this.$route.params.inboxId,
          sender_id: this.selectedSender || null,
          enabled: this.enabled,
          trigger_rules: {
            url: this.endPoint,
            time_on_page: this.timeOnPage,
          },
        };
      } else {
        const audience = this.selectedAudience.map(item => {
          return {
            id: item.id,
            type: 'Label',
          };
        });
        campaignDetails = {
          title: this.title,
          message: this.message,
          inbox_id: this.$route.params.inboxId,
          scheduled_at: this.scheduledAt,
          audience,
        };
      }
      return campaignDetails;
    },
    async addCampaign() {
      try {
        const campaignDetails = this.getCampaignDetails();
        await this.$store.dispatch('campaigns/create', campaignDetails);
        this.showAlert(this.$t('CAMPAIGN.ADD.API.SUCCESS_MESSAGE'));
        this.onClose();
      } catch (error) {
        const errorMessage =
          error?.response?.message || this.$t('CAMPAIGN.ADD.API.ERROR_MESSAGE');
        this.showAlert(errorMessage);
      }
    },
  },
};
</script>
