<template>
  <form @submit.prevent="onSubmit">
    <div class="merge-contacts">
      <div class="multiselect-wrap--small">
        <label class="multiselect__label">
          {{ $t('MERGE_CONTACTS.PRIMARY.TITLE') }}
        </label>
        <multiselect
          :value="primaryContact"
          disabled
          :options="[]"
          :show-labels="false"
          label="name"
          track-by="id"
        >
          <template slot="singleLabel" slot-scope="props">
            <contact-dropdown-item
              :thumbnail="props.option.thumbnail"
              :name="props.option.name"
            />
          </template>
        </multiselect>
      </div>

      <div class="child-contact-wrap">
        <div class="child-arrow">
          <i class="ion-ios-arrow-up up" />
        </div>
        <div
          class="child-contact multiselect-wrap--small"
          :class="{ error: $v.childContact.$error }"
        >
          <label class="multiselect__label">
            {{ $t('MERGE_CONTACTS.CHILD.TITLE') }}
          </label>
          <multiselect
            v-model="childContact"
            :options="searchResults"
            label="name"
            track-by="id"
            :internal-search="false"
            :clear-on-select="false"
            :show-labels="false"
            :placeholder="$t('MERGE_CONTACTS.CHILD.PLACEHOLDER')"
            :allow-empty="true"
            :loading="isSearching"
            :max-height="150"
            open-direction="top"
            @search-change="searchChange"
          >
            <template slot="singleLabel" slot-scope="props">
              <contact-dropdown-item
                :thumbnail="props.option.thumbnail"
                :name="props.option.name"
              />
            </template>
            <span slot="noResult">
              {{ $t('AGENT_MGMT.SEARCH.NO_RESULTS') }}
            </span>
          </multiselect>
          <span v-if="$v.childContact.$error" class="message">
            {{ $t('MERGE_CONTACTS.FORM.CHILD_CONTACT.ERROR') }}
          </span>
        </div>
      </div>
    </div>
    <merge-contact-summary
      :primary-contact-name="primaryContact.name"
      :child-contact-name="childContactName"
    />
    <div class="footer">
      <woot-button variant="clear" @click.prevent="onCancel">
        {{ $t('MERGE_CONTACTS.FORM.CANCEL') }}
      </woot-button>
      <woot-button type="submit" :is-loading="isMerging">
        {{ $t('MERGE_CONTACTS.FORM.SUBMIT') }}
      </woot-button>
    </div>
  </form>
</template>

<script>
import alertMixin from 'dashboard/mixins/alertMixin';
import { required } from 'vuelidate/lib/validators';

import MergeContactSummary from 'dashboard/modules/contact/components/MergeContactSummary';
import ContactDropdownItem from './ContactDropdownItem';

export default {
  components: { MergeContactSummary, ContactDropdownItem },
  mixins: [alertMixin],
  props: {
    primaryContact: {
      type: Object,
      required: true,
    },
    isSearching: {
      type: Boolean,
      default: false,
    },
    isMerging: {
      type: Boolean,
      default: false,
    },
    searchResults: {
      type: Array,
      default: () => [],
    },
  },
  validations: {
    primaryContact: {
      required,
    },
    childContact: {
      required,
    },
  },
  data() {
    return {
      childContact: undefined,
    };
  },

  computed: {
    childContactName() {
      return this.childContact ? this.childContact.name : '';
    },
  },
  methods: {
    searchChange(query) {
      this.$emit('search', query);
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$emit('submit', this.childContact.id);
    },
    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.child-contact-wrap {
  display: flex;
  width: 100%;
}
.child-contact {
  flex: 1 0 0;
  min-width: 0;
}
.child-arrow {
  width: var(--space-larger);
  position: relative;
  font-size: var(--font-size-default);
  color: var(--color-border-dark);
}
.multiselect {
  margin-bottom: var(--space-small);
}
.child-contact {
  margin-top: var(--space-smaller);
}
.child-arrow::after {
  content: '';
  height: var(--space-larger);
  width: 0;
  left: var(--space-two);
  position: absolute;
  border-left: 1px solid var(--color-border-dark);
}

.child-arrow::before {
  content: '';
  height: 0;
  width: var(--space-normal);
  left: var(--space-two);
  top: var(--space-larger);
  position: absolute;
  border-bottom: 1px solid var(--color-border-dark);
}

.up {
  position: absolute;
  top: -11px;
  left: var(--space-normal);
}

::v-deep .multiselect__tags .option__title {
  display: inline-flex;
  align-items: center;
  margin-left: var(--space-small);
}

.footer {
  margin-top: var(--space-medium);
  display: flex;
  justify-content: flex-end;
}

/* TDOD: Clean errors in forms style */
.error .message {
  margin-top: 0;
}
</style>
