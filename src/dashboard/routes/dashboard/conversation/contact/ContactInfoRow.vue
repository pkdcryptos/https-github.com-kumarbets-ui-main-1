<template>
  <div class="contact-info--row">
    <a v-if="href" :href="href" class="contact-info--details">
      <emoji-or-icon :icon="icon" :emoji="emoji" />
      <span v-if="value" class="text-truncate" :title="value">{{ value }}</span>
      <span v-else class="text-muted">{{
        $t('CONTACT_PANEL.NOT_AVAILABLE')
      }}</span>

      <woot-button
        v-if="showCopy"
        type="submit"
        variant="link"
        color-scheme="secondary"
        icon="ion-clipboard"
        class-names="icon copy-icon"
        @click="onCopy"
      />
    </a>

    <div v-else class="contact-info--details">
      <emoji-or-icon :icon="icon" :emoji="emoji" />
      <span v-if="value" class="text-truncate">{{ value }}</span>
      <span v-else class="text-muted">{{
        $t('CONTACT_PANEL.NOT_AVAILABLE')
      }}</span>
    </div>
  </div>
</template>
<script>
import copy from 'copy-text-to-clipboard';
import alertMixin from 'dashboard/mixins/alertMixin';
import EmojiOrIcon from 'dashboard/components/EmojiOrIcon';

export default {
  components: {
    EmojiOrIcon,
  },
  mixins: [alertMixin],
  props: {
    href: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    showCopy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onCopy(e) {
      e.preventDefault();
      copy(this.value);
      this.showAlert(this.$t('CONTACT_PANEL.COPY_SUCCESSFUL'));
    },
  },
};
</script>
<style scoped lang="scss">
.contact-info--row {
  .contact-info--icon {
    font-size: var(--font-size-default);
    min-width: var(--space-medium);
  }
}

.contact-info--details {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-small);
  color: var(--color-body);

  .copy-icon {
    margin-left: var(--space-smaller);
  }

  &.a {
    &:hover {
      text-decoration: underline;
    }
  }
}

.contact-info--details .icon--emoji,
.contact-info--details .icon--font {
  display: inline-block;
  width: var(--space-medium);
}
</style>
