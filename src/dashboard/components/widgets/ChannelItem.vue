<template>
  <div
    class="small-6 medium-4 large-3 columns channel"
    :class="{ inactive: !isActive }"
    @click="onItemClick"
  >
    <img
      v-if="channel.key === 'facebook'"
      src="~dashboard/assets/images/channels/facebook.png"
    />
    <img
      v-if="channel.key === 'twitter'"
      src="~dashboard/assets/images/channels/twitter.png"
    />
    <img
      v-if="channel.key === 'telegram'"
      src="~dashboard/assets/images/channels/telegram.png"
    />
    <img
      v-if="channel.key === 'api' && !channel.thumbnail"
      src="~dashboard/assets/images/channels/api.png"
    />
    <img
      v-if="channel.key === 'api' && channel.thumbnail"
      :src="channel.thumbnail"
    />
    <img
      v-if="channel.key === 'email'"
      src="~dashboard/assets/images/channels/email.png"
    />
    <img
      v-if="channel.key === 'line'"
      src="~dashboard/assets/images/channels/line.png"
    />
    <img
      v-if="channel.key === 'website'"
      src="~dashboard/assets/images/channels/website.png"
    />
    <img
      v-if="channel.key === 'sms'"
      src="~dashboard/assets/images/channels/sms.png"
    />
    <img
      v-if="channel.key === 'whatsapp'"
      src="~dashboard/assets/images/channels/whatsapp.png"
    />
    <h3 class="channel__title">
      {{ channel.name }}
    </h3>
  </div>
</template>
<script>
export default {
  props: {
    channel: {
      type: Object,
      required: true,
    },
    enabledFeatures: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isActive() {
      
      return true;
    },
  },
  methods: {
    onItemClick() {
      if (this.isActive) {
        this.$emit('channel-item-click', this.channel.key);
      }
    },
  },
};
</script>
