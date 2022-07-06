using System;
using System.Collections.Generic;

#nullable disable

namespace LogPeople.Domains
{
    public partial class Usuario
    {
        public int IdUsuario { get; set; }
        public byte IdTipo { get; set; }
        public string Foto { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public bool? Ativado { get; set; }

        public virtual Tipo IdTipoNavigation { get; set; }
    }
}
