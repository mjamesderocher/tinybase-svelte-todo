<script>
  export let pending
</script>

{$pending > 0 ? `Todo: ${$pending}` : 'All done!'}