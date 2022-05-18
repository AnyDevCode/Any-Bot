module.exports = {
  name: "modalSubmit",
  async execute(modal) {

    const Modal = modal.client.modals.get(modal.customId);

    if (!Modal) return;

    try {
      await Modal.run(modal);
    } catch(e) {
      if(e.message.includes("unknown type: 5")) return
      
      await Modal.reply({
        content: "An error occured while executing that command!",
        ephemeral: true
      })
    }




  }
}
